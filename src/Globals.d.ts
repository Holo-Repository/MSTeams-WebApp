declare module "*.module.css";

declare module globalThis {
    var raiseGlobalError: (error: Error) => Error;
}
