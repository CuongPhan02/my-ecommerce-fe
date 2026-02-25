import { cn } from '~/lib/utils'

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  fluid?: boolean
  ref?: React.Ref<HTMLElement>
}

export function MainContent({ fixed, className, fluid, ...props }: MainProps) {
  return (
    <main
      data-layout={fixed ? 'fixed' : 'auto'}
      className={cn(
        'px-4 py-6',

        // If layout is fixed, make the main container flex and grow
        fixed && 'flex grow flex-col ',

        // If layout is not fluid, set the max-width
        !fluid && 'mx-auto w-full main-container',
        className
      )}
      {...props}
    />
  )
}
