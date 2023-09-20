import { defineComponent, onMounted, ref } from "vue";
import { Gobang } from '@exile_song/func-utils'
declare global {  
    interface Window {  
      ins: any
    }  
  }
export default defineComponent({
    name: 'PlayGround',
    setup() {
        const rootRef = ref<HTMLElement>()
        onMounted(() => {
            const ins = new Gobang({
                rows: 20,
                cols: 20
            });
            console.log({ins})
            window.ins = ins
            ins.mount(rootRef.value as HTMLElement)
        })
        return () => (
            <div>
                <h1>PlayGround</h1>
                <div ref={rootRef}></div>
            </div>
        )
    }
})