import { useEffect } from "react"

export default function outsideClick(ref , handler) {
  
    useEffect(()=>{

        function listener(event : Event){
            if (!ref.current || ref.current.contains(event.target)){
                console.log('123')
                return
            }

            handler(event)

        }

        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart',listener)

        return () =>{
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        }

    },[handler, ref])
}
