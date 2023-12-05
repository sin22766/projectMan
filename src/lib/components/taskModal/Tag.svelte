<script lang="ts">
	import { twMerge } from "tailwind-merge";


    const {class: propClasses} = $$restProps
    
    let sizingClasses = 'px-3 py-1 rounded-md text-thin'
    let colorClasses = 'bg-[#F59E0B] text-white'
    let tagClasses = twMerge(sizingClasses, colorClasses, propClasses)

</script>

<div class='flex'>
    <div class={tagClasses}>
        <slot></slot>
    </div>
</div>

