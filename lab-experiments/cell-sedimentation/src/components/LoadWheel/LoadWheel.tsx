import { type Accessor, type Component } from 'solid-js';
import './LoadWheel.css';

export type LoadingWheelProps = {
    isLoading: Accessor<boolean>;
};

export const LoadWheel: Component<LoadingWheelProps> = ({ isLoading }) => {
  return (
    <>
        {isLoading() && <div class="load-backdrop" />}
        <div class={`load-wheel ${isLoading() ? 'loading' : 'hidden'}`}>
            <div class="spinner"></div>
            {isLoading() && <p>Loading...</p>}
        </div>
    </>
  );
}