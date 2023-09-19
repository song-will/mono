import { defineComponent } from "vue";
import { add } from '@exile_song/func-utils'

export default defineComponent({
    name: 'PlayGround',
    setup() {
        return () => (
            <div>
                <h1>PlayGround</h1>
                <div>{ add(1,2) }</div>
            </div>
        )
    }
})