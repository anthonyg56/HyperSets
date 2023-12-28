import React from 'react'
import HardwareTile from './components/HardwareTile'

const hardware = {
  keyboard: {
    photo: {
      src: "/Assets/hardware/keyboard.png",
      alt: "HyperX Alloys Origins 60"
    },
    gradient: {
      src: "/Assets/hardware/keyboard-gradient.png",
      alt: "Keyboard Gradient"
    }
  },
  mic: {
    photo: {
      src: "/Assets/hardware/mic.png",
      alt: "HyperX QuadCast S"
    },
    gradient: {
      src: "/Assets/hardware/mic-gradient.png",
      alt: "Mic Gradient"
    }
  },
  mouse: {
    photo: {
      src: "/Assets/hardware/mouse.png",
      alt: "HyperX Pulsefire 2"
    },
    gradient: {
      src: "/Assets/hardware/mouse-gradient.png",
      alt: "Mouse gradient"
    }
  },
  headset: {
    photo: {
      src: "/Assets/hardware/headset.png",
      alt: "HyperX Cloud Alpha II"
    },
    gradient: {
      src: "/Assets/hardware/headset-gradient.png",
      alt: "Headset gradient"
    }
  },
  new: {
    photo: {
      src: "/Assets/hardware/new.png",
      alt: "HyperX Cloud Alpha II"
    },
    gradient: {
      src: "/Assets/hardware/new-preset-gradient.png",
      alt: "Headset gradient"
    }
  }
}

export default function page() {

  return (
    <div className='container pt-[120px]'>
      <div className='text-container pb-[50px]'>
        <h2 className='title-2xl-upper'>Custom Presets</h2>
        <h4 className='sub-text'>Lorem ipsum, or lipsum as it is sometimes known</h4>
      </div>

      <HardwareTile
        url='/presets/Keyboard'
        gradient={hardware.keyboard.gradient}
        photo={hardware.keyboard.photo}
        name="Alloy Origins"
      />
      <HardwareTile
        url='/presets/Microphone'
        gradient={hardware.mic.gradient}
        photo={hardware.mic.photo}
        name='QuadCast'
      />
      <HardwareTile
        url='/presets/Mouse'
        gradient={hardware.mouse.gradient}
        photo={hardware.mouse.photo}
        name='Pulsefire'
      />
      <HardwareTile
        url='/presets/Headset'
        gradient={hardware.headset.gradient}
        photo={hardware.headset.photo}
        name='Cloud Alpha II'
      />
      <HardwareTile
        url='/presets/new'
        gradient={hardware.new.gradient}
        photo={hardware.new.photo}
        name='Create a Preset'
      />
    </div>
  )
}
