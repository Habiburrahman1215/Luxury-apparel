import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
    'inline-flex items-center justify-center font-medium tracking-wide uppercase leading-tight transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]',
    {
        variants: {
            variant: {
                primary: 'bg-charcoal text-stone border border-charcoal hover:bg-stone hover:text-charcoal shadow-sm',
                secondary: 'bg-stone text-charcoal border border-stone hover:bg-charcoal hover:text-stone shadow-sm',
                outline: 'border border-stone text-charcoal hover:bg-stone hover:text-charcoal',
                outlineIvory: 'border border-ivory text-ivory hover:bg-ivory hover:text-charcoal',
                gold: 'bg-gold text-stone hover:bg-charcoal hover:text-gold border border-gold',
                ghost: 'hover:bg-stone/20 text-charcoal',
                link: 'text-charcoal underline-offset-4 hover:underline',
            },
            size: {
                sm: 'px-6 py-2 text-[10px]',
                md: 'px-8 py-3 text-xs',
                lg: 'px-10 py-5 text-sm',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
)
