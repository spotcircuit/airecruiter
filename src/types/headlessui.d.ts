declare module '@headlessui/react' {
  import { FC, ReactNode, RefObject } from 'react';

  export const Transition: {
    Root: FC<{
      show?: boolean;
      appear?: boolean;
      as?: React.ElementType;
      children: ReactNode;
      unmount?: boolean;
      enter?: string;
      enterFrom?: string;
      enterTo?: string;
      leave?: string;
      leaveFrom?: string;
      leaveTo?: string;
      afterLeave?: () => void;
      beforeEnter?: () => void;
      afterEnter?: () => void;
      beforeLeave?: () => void;
    }>;
    Child: FC<{
      as?: React.ElementType;
      children: ReactNode;
      unmount?: boolean;
      enter?: string;
      enterFrom?: string;
      enterTo?: string;
      leave?: string;
      leaveFrom?: string;
      leaveTo?: string;
      afterLeave?: () => void;
      beforeEnter?: () => void;
      afterEnter?: () => void;
      beforeLeave?: () => void;
    }>;
  };

  export const Dialog: {
    (props: {
      as?: React.ElementType;
      className?: string;
      open?: boolean;
      onClose: () => void;
      children: ReactNode;
      initialFocus?: RefObject<HTMLElement>;
    }): JSX.Element;
    Panel: FC<{
      as?: React.ElementType;
      className?: string;
      focus?: boolean;
      children: ReactNode;
      ref?: RefObject<HTMLElement>;
    }>;
    Title: FC<{
      as?: React.ElementType;
      className?: string;
      children: ReactNode;
    }>;
    Description: FC<{
      as?: React.ElementType;
      className?: string;
      children: ReactNode;
    }>;
  };

  export const Fragment: React.ElementType;
}