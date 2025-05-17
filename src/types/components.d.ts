declare module '@/components/ErrorBoundary' {
  import { Component, ReactNode } from 'react';

  interface Props {
    children: ReactNode;
    fallback?: ReactNode;
  }

  export class ErrorBoundary extends Component<Props> {}
}

declare module '@/components/LoadingSkeleton' {
  interface LoadingSkeletonProps {
    count?: number;
    className?: string;
  }

  export function LoadingSkeleton(props: LoadingSkeletonProps): JSX.Element;
} 