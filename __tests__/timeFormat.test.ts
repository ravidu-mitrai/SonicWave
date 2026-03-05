import { formatTime } from '../utils/timeFormat';

describe('formatTime utility', () => {
  it('formats exactly zero seconds', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('formats less than a minute correctly', () => {
    expect(formatTime(45)).toBe('0:45');
  });

  it('formats exactly one minute correctly', () => {
    expect(formatTime(60)).toBe('1:00');
  });

  it('formats minutes and seconds correctly', () => {
    expect(formatTime(125)).toBe('2:05');
  });
});