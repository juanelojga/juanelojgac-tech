/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare module "*.astro" {
  // If you want proper typing you can refine this later.
  const Component: any;
  export default Component;
}
