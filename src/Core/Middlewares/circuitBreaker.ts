import CircuitBreaker from 'opossum';
import { AppDataSource } from '../../DAL/config/data-source';

const options = {
  timeout: 3000,                  
  errorThresholdPercentage: 50,   
  resetTimeout: 30000,           
};

export function createBreaker<T>(asyncFn: (...args: any[]) => Promise<T>) {
  const breaker = new CircuitBreaker(asyncFn, options);

  breaker.on('open', () =>
    console.log(JSON.stringify({ level: 'warn', message: 'Circuit OPEN — DB calls blocked', ts: new Date().toISOString() }))
  );
  breaker.on('halfOpen', () =>
    console.log(JSON.stringify({ level: 'info', message: 'Circuit HALF-OPEN — testing...', ts: new Date().toISOString() }))
  );
  breaker.on('close', () =>
    console.log(JSON.stringify({ level: 'info', message: 'Circuit CLOSED — DB recovered', ts: new Date().toISOString() }))
  );

  breaker.fallback(() => {
    throw new Error('Service temporarily unavailable. Please try again shortly.');
  });

  return breaker;
}