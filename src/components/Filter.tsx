import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  ThemeProvider,
  createTheme,
  Theme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs, { Dayjs } from 'dayjs';

// Default size configuration
const DEFAULT_SIZES = {
  width: 300, // Reduced from 400
  padding: 1, // Reduced from 2
  spacing: 0.5, // Spacing between elements
  sliderHeight: 65, // Height for slider sections
  inputHeight: 50, // Height for input fields
} as const;

type DateFilterType = 'in' | 'before' | 'after' | 'between';

interface SizeConfig {
  width?: number;
  padding?: number;
  spacing?: number;
  sliderHeight?: number;
  inputHeight?: number;
}

interface DateFilter {
  type: DateFilterType;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

interface FilterState {
  issues: {
    min: number;
    max: number;
  };
  pullRequests: {
    min: number;
    max: number;
  };
  stars: {
    min: number;
    max: number;
  };
  languages: string[];
  created: DateFilter;
  lastPush: DateFilter;
  label: {
    name: string;
    range: {
      min: number;
      max: number;
    };
  };
}

interface FilterProps {
  onFilterChange?: (filters: FilterState) => void;
  theme?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  sizes?: SizeConfig;
}

const LANGUAGES = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'Ruby',
  'Go',
  'TypeScript',
  'PHP',
  'C#',
  'Swift',
  'Rust',
  'Kotlin'
];

const DATE_FILTER_TYPES: { value: DateFilterType; label: string }[] = [
  { value: 'in', label: 'In' },
  { value: 'before', label: 'Before' },
  { value: 'after', label: 'After' },
  { value: 'between', label: 'Between' },
];

const defaultDateFilter: DateFilter = {
  type: 'in',
  startDate: null,
  endDate: null,
};

const createCustomTheme = (customTheme?: FilterProps['theme']): Theme => {
  return createTheme({
    palette: {
      primary: {
        main: customTheme?.primary || '#1976d2',
      },
      secondary: {
        main: customTheme?.secondary || '#dc004e',
      },
      background: {
        default: customTheme?.background || '#ffffff',
      },
      text: {
        primary: customTheme?.text || '#000000',
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& fieldset': {
              borderRadius: 4,
            },
          },
        },
      },
    },
  });
};

const Filter: React.FC<FilterProps> = ({ onFilterChange, theme, sizes }) => {
  // Merge default sizes with custom sizes
  const currentSizes = {
    ...DEFAULT_SIZES,
    ...sizes,
  };

  const [issuesRange, setIssuesRange] = useState<[number, number]>([0, 1000000]);
  const [prRange, setPrRange] = useState<[number, number]>([0, 1000000]);
  const [starsRange, setStarsRange] = useState<[number, number]>([0, 1000000]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [createdDateFilter, setCreatedDateFilter] = useState<DateFilter>(defaultDateFilter);
  const [lastPushDateFilter, setLastPushDateFilter] = useState<DateFilter>(defaultDateFilter);
  const [labelName, setLabelName] = useState<string>('');
  const [labelRange, setLabelRange] = useState<[number, number]>([0, 1000000]);

  const customTheme = createCustomTheme(theme);

  const resetFilters = () => {
    setIssuesRange([0, 1000000]);
    setPrRange([0, 1000000]);
    setStarsRange([0, 1000000]);
    setSelectedLanguages([]);
    setCreatedDateFilter(defaultDateFilter);
    setLastPushDateFilter(defaultDateFilter);
    setLabelName('');
    setLabelRange([0, 1000000]);
  };

  useEffect(() => {
    const filters: FilterState = {
      issues: {
        min: issuesRange[0],
        max: issuesRange[1]
      },
      pullRequests: {
        min: prRange[0],
        max: prRange[1]
      },
      stars: {
        min: starsRange[0],
        max: starsRange[1]
      },
      languages: selectedLanguages,
      created: createdDateFilter,
      lastPush: lastPushDateFilter,
      label: {
        name: labelName,
        range: {
          min: labelRange[0],
          max: labelRange[1]
        }
      }
    };

    onFilterChange?.(filters);
  }, [
    issuesRange,
    prRange,
    starsRange,
    selectedLanguages,
    createdDateFilter,
    lastPushDateFilter,
    labelName,
    labelRange,
    onFilterChange
  ]);

  const handleRangeChange = (setter: React.Dispatch<React.SetStateAction<[number, number]>>) => 
    (_event: Event, newValue: number | number[]) => {
      setter(newValue as [number, number]);
    };

  const handleLanguageChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setSelectedLanguages(typeof value === 'string' ? value.split(',') : value);
  };

  const renderDateFilter = (
    filter: DateFilter,
    setFilter: React.Dispatch<React.SetStateAction<DateFilter>>,
    label: string
  ) => (
    <Box sx={{ mb: currentSizes.spacing }}>
      <Typography variant="body2" gutterBottom>{label}</Typography>
      <FormControl fullWidth sx={{ mb: 1 }}>
        <Select
          size="small"
          value={filter.type}
          onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as DateFilterType }))}
          sx={{ height: currentSizes.inputHeight }}
        >
          {DATE_FILTER_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <DatePicker
          label={filter.type === 'between' ? 'Start Date' : 'Date'}
          value={filter.startDate}
          onChange={(newValue) => setFilter(prev => ({ ...prev, startDate: newValue }))}
          slotProps={{ 
            textField: { 
              fullWidth: true, 
              size: "small",
              sx: { height: currentSizes.inputHeight }
            } 
          }}
        />
        {filter.type === 'between' && (
          <DatePicker
            label="End Date"
            value={filter.endDate}
            onChange={(newValue) => setFilter(prev => ({ ...prev, endDate: newValue }))}
            slotProps={{ 
              textField: { 
                fullWidth: true, 
                size: "small",
                sx: { height: currentSizes.inputHeight }
              } 
            }}
          />
        )}
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={customTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ 
          width: currentSizes.width, 
          p: currentSizes.padding, 
          bgcolor: 'background.default',
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: currentSizes.spacing 
          }}>
            <Typography variant="subtitle1">
              Repository Filters
            </Typography>
            <Button 
              variant="outlined" 
              onClick={resetFilters}
              size="small"
            >
              Reset
            </Button>
          </Box>

          {/* Issues Count Range */}
          <Box sx={{ mb: currentSizes.spacing, height: currentSizes.sliderHeight }}>
            <Typography variant="body2" gutterBottom>Issues Count</Typography>
            <Slider
              size="small"
              value={issuesRange}
              onChange={handleRangeChange(setIssuesRange)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">{issuesRange[0]}</Typography>
              <Typography variant="caption">{issuesRange[1]}</Typography>
            </Box>
          </Box>

          {/* Pull Requests Range */}
          <Box sx={{ mb: currentSizes.spacing, height: currentSizes.sliderHeight }}>
            <Typography variant="body2" gutterBottom>Pull Request Count</Typography>
            <Slider
              size="small"
              value={prRange}
              onChange={handleRangeChange(setPrRange)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">{prRange[0]}</Typography>
              <Typography variant="caption">{prRange[1]}</Typography>
            </Box>
          </Box>

          {/* Stars Range */}
          <Box sx={{ mb: currentSizes.spacing, height: currentSizes.sliderHeight }}>
            <Typography variant="body2" gutterBottom>Stars</Typography>
            <Slider
              size="small"
              value={starsRange}
              onChange={handleRangeChange(setStarsRange)}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">{starsRange[0]}</Typography>
              <Typography variant="caption">{starsRange[1]}</Typography>
            </Box>
          </Box>

          {/* Languages Multiselect */}
          <FormControl fullWidth sx={{ mb: currentSizes.spacing }}>
            <InputLabel size="small">Languages</InputLabel>
            <Select<string[]>
              multiple
              size="small"
              value={selectedLanguages}
              onChange={handleLanguageChange}
              input={<OutlinedInput label="Languages" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              sx={{ height: currentSizes.inputHeight }}
            >
              {LANGUAGES.map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Created Date Filter */}
          {renderDateFilter(createdDateFilter, setCreatedDateFilter, 'Created Date')}

          {/* Last Push Date Filter */}
          {renderDateFilter(lastPushDateFilter, setLastPushDateFilter, 'Last Push Date')}

          {/* Advanced Filter - Labels */}
          <Accordion>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ minHeight: currentSizes.inputHeight }}
            >
              <Typography variant="body2">Advanced Filter - Labels</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                size="small"
                label="Label Name"
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
                sx={{ mb: 2, height: currentSizes.inputHeight }}
              />
              <Typography variant="body2" gutterBottom>Label Count Range</Typography>
              <Slider
                size="small"
                value={labelRange}
                onChange={handleRangeChange(setLabelRange)}
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">{labelRange[0]}</Typography>
                <Typography variant="caption">{labelRange[1]}</Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default Filter;