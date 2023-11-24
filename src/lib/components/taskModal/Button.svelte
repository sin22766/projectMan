<script lang="ts">
    import { twMerge } from 'tailwind-merge'

    let buttonType:string = 'submit'

    const {class: propClasses, ...rest} = $$restProps

    const colorClasses = 'bg-submit text-white'

    const sizingClass = 'py-1 px-4 rounded-md'

    let buttonClass: string
    $: buttonClass = twMerge(colorClasses, sizingClass, propClasses)
</script>

<button class={buttonClass} {...rest} on:click>
    <slot></slot>
</button>