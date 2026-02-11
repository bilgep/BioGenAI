export function consoleLogger(req: any, res: any, next: any){
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
}