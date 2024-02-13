import { Suspense } from 'react';
export default function withSuspense(Component, SuspenseComponent) {
  return function WithSuspense(props) {
    return <Suspense fallback={SuspenseComponent}>
        <Component {...props} />
      </Suspense>;
  };
}