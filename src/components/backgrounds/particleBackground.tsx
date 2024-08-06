import * as React from 'react';
import style from './style.module.css';
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
import { useEffect } from 'react';

interface IParticleBackgroundProps {
  height: string;
  width: string;
  backgroundColor: string;
  tileHeight: number;
  tileWidth: number;
}

const COLOURS = [
  '#18191C',  
  '#2E2F35',  
  '#3D3F3F',  
];

const ParticleBackground: React.FunctionComponent<React.PropsWithChildren<IParticleBackgroundProps>> = (props) => {
  const { backgroundColor, height, width, tileHeight, tileWidth, children } = props;
  const colour = useMotionValue(COLOURS[0]);
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #18191C 50%, ${colour})`;

  useEffect(() => {
    animate(colour, COLOURS, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  // Calculate the height for the #stars div
  const halfTileHeight = tileHeight / 2;
  const halfTileWidth = tileWidth /2;
  const starsHeight = `calc(50vh - ${halfTileHeight}px)`;
  const starsWidth = `calc(50vw - ${halfTileWidth}px)`
  const stars3Padding = `calc(50vw + ${halfTileHeight}px)`

  return (
    <>
      <motion.div id={style.authMain} 
        style={{ 
          width: width, 
          height: height, 
          backgroundImage 
        }}>
        {children}
        <div id={style.stars} style={{ width: '100vw', height: starsHeight }}>
          <Canvas>
            <Stars radius={500} count={3750} factor={4} fade speed={2}/>
          </Canvas>
        </div>
        <div id={style.stars2} style={{width : starsWidth, height:'85vh'}}>
          <Canvas>
            <Stars radius={500} count={17500} factor={5} fade speed={2}/>
          </Canvas>
        </div>
        <div id={style.stars3} style={{ width:'40%', marginLeft:stars3Padding}}>
          <Canvas>
            <Stars radius={500} count={7500} factor={4} fade speed={2}/>
          </Canvas>
        </div>
      </motion.div>
    </>
  );
};

export default ParticleBackground;
