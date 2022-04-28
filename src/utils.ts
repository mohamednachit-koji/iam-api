export const injectFeature = (Feature, dependencies = []) => ({
  provide: Feature,
  useFactory: (...injectedDependencies) => {
    return new Feature(...injectedDependencies);
  },
  inject: dependencies,
});
