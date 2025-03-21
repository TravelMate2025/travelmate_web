import CircularProgress from '@mui/material/CircularProgress';

interface SpinnerProps {
  size?: number | string;
  borderWidth?: number;
}

function Spinner({ size = 40, borderWidth = 4 }: SpinnerProps) {
  const numericSize = typeof size === 'string' ? parseInt(size, 10) : size;

  return (
    <CircularProgress
      size={numericSize}
      thickness={borderWidth}
      sx={{ color: 'white' }}
    />
  );
}

export default Spinner;