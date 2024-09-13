import React, { useRef } from 'react'
import { useGLTF} from '@react-three/drei'
import { useFrame } from '@react-three/fiber';

export default function Model(props) {
  const { nodes, materials } = useGLTF('media/sun/sun.gltf')
  const sunRef = useRef()

  // Rotate the sun continuously
  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += -0.0075 // Adjust this value to control speed
    }
  })

  return (
    <group ref={sunRef} scale={0.0285} {...props} dispose={null}>
      <mesh 
        geometry={nodes.Sphere_Material002_0.geometry} 
        material={materials['Material.002']} 
        rotation={[-Math.PI / 2, 0, 0]} 
        scale={100} 
      />
    </group>
  )
}

useGLTF.preload('/sun.gltf')
