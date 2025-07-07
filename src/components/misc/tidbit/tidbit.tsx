import * as React from 'react';
import style from './style.module.css';
import { Poppins } from 'next/font/google';


const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface ITidbitProps {
}

const Tidbit: React.FunctionComponent<ITidbitProps> = (props) => {
  return<>
   <div id={style.tidbit}>
     <div style={{ display:"flex", justifyContent:"center", alignItems:"center"}}>
      <h2 className={font.className} id={style.tidbitTitle}> The Sun.</h2>
     </div>
     <p id={style.tidbitText}>
      The sun, a fiery, radiant sphere, dominates the sky with its intense, golden glow. Its powerful rays provide warmth and life, fueling the Earth’s ecosystems. Ever constant, the sun shines brightly, a timeless, celestial force that energizes and sustains, creating cycles of day and night, brightening our world endlessly.
     </p>
    </div>
    <div id={style.tidbitCorner}></div>
  </> ;
};

export default Tidbit;
