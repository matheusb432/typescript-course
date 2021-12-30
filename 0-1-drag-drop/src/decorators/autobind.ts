namespace App {
  export function Autobind(
    _: any,
    _2: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: false,
      get() {
        return originalMethod.bind(this);
      },
    };

    return adjustedDescriptor;
  }
}
