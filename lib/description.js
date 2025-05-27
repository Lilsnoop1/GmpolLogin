const machine_Description = [
  {
    "name": "Mechanical Scale",
    "description": "Mechanical scales rely on physical principles such as spring tension, balance beams, levers, and counterweights to measure mass. They are durable, require no electricity, and are still used in industrial, agricultural, and medical contexts.",
    "features": [
      "Spring-based and lever mechanisms",
      "Manual calibration",
      "Durable materials",
      "Analog or mechanical readouts"
    ],
    "specifications": {
      "precision": "0.5% to 2%",
      "durability": "High with proper maintenance",
      "calibration": "Manual, using known weights",
      "materials": "Cast iron, steel, brass, glass"
    }
  },
  {
    "name": "Generic C-arm X-Ray System",
    "description": "Mobile X-ray system with a rotating anode tube and high-frequency generator designed for precision fluoroscopy and radiographic imaging in medical procedures.",
    "features": [
      "Triple mode image intensifier",
      "16-bit image processing",
      "Motion detection",
      "Subtracted fluoroscopy",
      "Remote control and touchscreen options",
      "DICOM connectivity"
    ],
    "specifications": {
      "X-ray_tube": "Rotating anode with active heat management",
      "X-ray_generator": "Monoblock 80 kHz high-frequency, microprocessor controlled",
      "power": "15 kW, 120 kV, 125 mA",
      "geometry": {
        "free_space_C_arm": "77 cm",
        "C_arm_depth": "61 cm",
        "rotation": "±180°, stop at ±135°",
        "angulation": "+90° to -25° (optional: -45°)",
        "SID": "98 cm"
      },
      "imaging_chain": {
        "image_intensifier": "Triple mode 9 inch or 12 inch",
        "TV_camera": "High resolution 1K² CCD",
        "beam_filtration": "0.1 mm Cu + 3 mm AI",
        "processing": "16-bit with motion detection"
      },
      "connectivity": {
        "video_in": "S-video",
        "analog_video_out": "1 BNC connector",
        "digital_video_out": "2 DVI (optional)",
        "USB_storage": "bmp format",
        "DICOM": "Advanced package with full IHE compliance"
      }
    }
  },
  {
    "name": "Philips BV300 Plus",
    "description": "Advanced mobile C-arm system designed for real-time fluoroscopy and radiography with high-resolution image intensifiers and extensive imaging options.",
    "features": [
      "Extended and vascular fluoroscopy modes",
      "Pulsed and continuous imaging",
      "Motorized camera with image reversal",
      "Dual 17 monitors with ambient light sensors",
      "Optional hardcopy and DICOM output"
    ],
    "specifications": {
      "generator": {
        "type": "2.1 kW full-wave",
        "voltage": "Up to 110 kVp",
        "mA": "Up to 20 mA for radiographic film",
        "fluoro_boost": "7.3 mA"
      },
      "X-ray_tube": {
        "type": "Fixed anode",
        "focal_spots": "0.6 mm and 1.4 mm",
        "heat_capacity": "50,100 HU",
        "cooling_rate": "20,200 HU/min",
        "housing_capacity": "1,200,000 HU",
        "angle": "12°"
      },
      "fluoroscopy": {
        "low_dose_mode": "0.1 – 3.1 mA",
        "boost_mode": "0.2 – 7.3 mA",
        "pulsed": {
          "optional": true,
          "range": "0.4 – 12 mA",
          "pulse_rate": "6.25 or 12.5 pps",
          "width": "11–37 ms"
        },
        "fluorography": {
          "optional": true,
          "range": "Up to 60 mA",
          "pulse_rate": "3–30 pps",
          "width": "8.0–11.1 ms"
        }
      },
      "radiographic_mode": {
        "focal_spot": "1.4 mm",
        "range": "40 – 105 kVp",
        "mA": "Fixed 20 mA"
      },
      "video_imaging": {
        "image_intensifier": {
          "9_in": {
            "modes": ["9", "7", "5"],
            "resolution": {
              "9": "1.6 lp/mm",
              "7": "2.2 lp/mm",
              "5": "2.9 lp/mm"
            },
            "DQE": "65%"
          },
          "12_in_optional": {
            "modes": ["12", "9", "7"],
            "resolution": {
              "12": "1.2 lp/mm",
              "9": "1.6 lp/mm",
              "7": "2.2 lp/mm"
            },
            "DQE": "65%"
          }
        },
        "camera": {
          "type": "High resolution CCD",
          "rotation": "360° motorized",
          "reversal": ["Left-right", "Top-bottom"],
          "modes": ["Negative", "Gain control", "Camera iris (optional)"]
        },
        "monitors": "Dual 17 anti-glare",
        "output": ["Thermal printer (optional)", "DICOM (optional)", "Image Capture"]
      },
      "dimensions": {
        "C_arm": {
          "height": "69 / 89 in",
          "width": "35 in",
          "length": "72 in",
          "weight": "695 lbs"
        },
        "workstation": {
          "height": "69 in",
          "width": "37 in",
          "depth": "37 in",
          "weight": "463 lbs"
        }
      }
    }
  },
  {
    "name": "Carestream CR Systems",
    "description": "A line of digital imaging solutions offering high-quality radiographic images and flexible configurations for medical imaging in various clinical settings.",
    "features": [
      "EVP-Plus Image-Processing with Enhanced Frequency Processing (EFP)",
      "User-friendly interface with optional touchscreen monitors",
      "Flexible installation: floor-stand console or wall mount",
      "Digital image sharing and collaboration features",
      "Classic System: compact and easy to use",
      "Vita XE: affordable solution for small to midsize facilities",
      "Vita Flex: orientation and throughput flexibility"
    ],
    "specifications": {}
  },
  {
    "name": "GE Voluson E6",
    "description": "High-performance ultrasound machine designed for women's health applications with support for 2D, 3D, and 4D imaging, featuring Radiance System Architecture and HDLive technology.",
    "features": [
      "2D, 3D, and 4D imaging capabilities",
      "Radiance System Architecture",
      "HD-Flow and HDLive for vascular and fetal imaging",
      "3 active probe ports and 1 parking slot",
      "19 tilt/rotate monitor and 10.4 touchscreen"
    ],
    "specifications": {
      "imaging_modes": ["B-Mode", "M-Mode", "Color Flow", "3D/4D"],
      "monitor": "19 in adjustable, 10.4 in touch panel",
      "dimensions": {
        "height": "1330–1670 mm",
        "width": "580 mm",
        "depth": "940 mm"
      }
    }
  },
  {
    "name": "GE Vivid E9",
    "description": "GE Vivid E9 is an advanced cardiovascular ultrasound system designed for 4D imaging, strain analysis, and precise anatomical visualization, supported by robust automation and imaging optimization tools.",
    "features": [
      "17 HD LCD, tilt/rotate adjustable monitor",
      "4D, Bi-plane/Tri-plane imaging modes",
      "Strain and Elastography options",
      "Auto Optimization and Speckle Reduction",
      "DICOM 3.1 support"
    ],
    "specifications": {
      "dimensions": {
        "height": "54.1 / 62.0 in",
        "width": "21.2 in",
        "depth": "31.4 in",
        "weight": "283 lbs"
      }
    }
  },
  {
    "name": "HP SONOS 5500",
    "description": "The HP SONOS 5500 is a highly configurable ultrasound system with broad clinical applications including cardiology, OB/GYN, vascular, and musculoskeletal imaging. It offers reliable performance and user-focused features.",
    "features": [
      "15-inch color monitor with touch interface",
      "Supports 2D, M-Mode, Color/Spectral Doppler",
      "Wide transducer compatibility",
      "DICOM connectivity and image storage",
      "Advanced image processing and customization"
    ],
    "specifications": {
      "dimensions": {
        "height": "105 cm",
        "width": "52 cm",
        "depth": "92 cm",
        "weight": "170-200 kg"
      }
    }
  },
  {
    "name": "High Frequency X-Ray System",
    "description": "A high-performance C-Arm system ideal for surgical and vascular interventions, featuring robust imaging options, digital enhancements, and multiple configurations for optimized diagnostic capability.",
    "features": [
      "4.0 kW high-frequency generator, up to 120 kVp",
      "Rotating anode tube with 0.3 mm and 0.6 mm focal spots",
      "Advanced pulsed fluoroscopy and fluorography modes",
      "9 and optional 12 tri-mode image intensifiers",
      "Digital image rotation, inversion, and positioning",
      "Dual 16 monitors or optional 32 LED display"
    ],
    "specifications": {
      "dimensions": {
        "C-Arm": {
          "height": "68 / 86 in",
          "width": "33 in",
          "length": "78 in",
          "weight": "720 lbs"
        },
        "Workstation": {
          "height": "64 in",
          "width": "27 in",
          "depth": "27 in",
          "weight": "430 lbs"
        }
      }
    }
  },
  {
  "name": "SIEMENS SIRA MOBILE",
  "description": "The SIEMENS SIRA MOBILE is a versatile mobile C-Arm imaging system designed for advanced medical imaging applications. It offers precise and flexible movement capabilities combined with high-quality image display, making it ideal for various diagnostic and interventional procedures. Its motorized vertical travel and orbital movement allow for accurate positioning, while multiple display sizes provide clear visualization for clinicians.",
  "features": [
    "Mobile C-Arm chassis for easy maneuverability",
    "Orbital movement of 130° for flexible imaging angles",
    "Motorized vertical travel up to 45 cm",
    "Multiple screen size options (15”, 17”, 18” TFT) with high contrast and brightness",
    "High precision X-Ray with adjustable kV and mA ranges",
    "Compact and ergonomic display trolley options"
  ],
  "specifications": {
    "weight_c_arm_chassis": "257 kg (565 lbs)",
    "weight_display_trolley_one_display": "112 kg (245 lbs)",
    "weight_display_trolley_two_displays": "138 kg (305 lbs)",
    "orbital_movement": "130° (–40° to +90°)",
    "horizontal_movement": "20 cm (7.9”)",
    "vertical_travel": "45 cm (17.7”), motorized",
    "display_sizes": "15”, 17”, and 18” TFT displays",
    "xray_kv_range": "40-110 kV",
    "xray_ma_range": "Up to 20 mA"
  }
},
{
  "name": "Ultrasound System for Anatomy Department",
  "description": "A state-of-the-art fully digital ultrasound system designed specifically for high-resolution trans-abdominal examinations. It integrates advanced electronic phased array technology with extensive imaging features, offering superior resolution, penetration, and diagnostic flexibility. The system is DICOM-ready and supports seamless integration with hospital information systems.",
  "features": [
    "Latest generation electronic phased array system with minimum 1000 independent channels",
    "DICOM-ready for HIS/RIS/PACS integration",
    "Field upgradable software with free upgrades for 3 years",
    "Frequency compounding technology for enhanced resolution and penetration",
    "Harmonic imaging across all probes with adjustable settings",
    "Trapezoidal imaging mode",
    "Automated gain control for flexible image quality management",
    "Real-time high-frequency 2D imaging for superior resolution",
    "High-resolution 15\" or larger color monitor with tilt and swivel functionality",
    "User-defined presets for multi-user department customization",
    "Comprehensive pre and post processing maps",
    "Large image storage capacity (80 GB HDD and 4.8 GB optical drive)",
    "Cine loop memory supporting high frame rate playback and quad loop comparisons",
    "Frame grabber facility for post-study analysis",
    "High definition digital acquisition, review, and editing capabilities",
    "Frame rate of 1000 FPS or higher"
  ],
  "specifications": {
    "phased_array_channels": "Minimum 1000 independent electronic channels",
    "gray_shades": "256 shades for sharp contrast resolution",
    "probe": "Latest generation wide band transducer",
    "monitor_size": "15\" or more, high-resolution color display",
    "image_modes": [
      "Harmonic imaging",
      "Trapezoidal image"
    ],
    "storage": {
      "hard_drive": "80 GB",
      "optical_disc_drive": "Minimum 4.8 GB"
    },
    "cine_loop_memory": {
      "frames": "More than 100 frames",
      "quad_loop_memory": "256 frames or more",
      "features": [
        "High frame rate review",
        "Slow motion playback",
        "Pre and post image comparison",
        "Frame grabber for analysis"
      ]
    },
    "frame_rate": "1000 FPS or more",
    "operational_environment": {
      "temperature": "Up to 30°C ambient",
      "humidity": "Up to 80% relative humidity"
    },
    "power_supply": {
      "input_voltage": "220-240 VAC, 50Hz",
      "protections": [
        "Resettable over current breaker",
        "Servo controlled stabilizer/CVT",
        "Online UPS with 30 minutes backup and voltage regulation"
      ]
    },
    "certifications": [
      "FDA or CE approved",
      "IEC-60601 electrical safety standards",
      "IEC 60601-2-37 for ultrasound safety",
      "ISO quality certification"
    ],
    "safety_features": {
      "electric_shock_protection": {
        "ultrasound_probes": "Type BF",
        "ECG_electrodes": "Type CF",
        "protection_class": "Class I"
      }
    },
    "accessories": [
      "Convex probe 2–5 MHz",
      "B/W thermal printer",
      "DVD/CD recorder with DICOM media transfer"
    ],
    "documentation": [
      "User manual in English",
      "Service manual in English",
      "Spare parts and accessories list with part numbers and costs"
    ],
    "service_support": [
      "Remote service network connectivity",
      "Optional service agreement",
      "Online phone support",
      "Clinical application support"
    ]
  }
},
{
  "name": "Nicolet EMG System",
  "description": "A versatile electromyography system designed for comprehensive neuromuscular diagnostics, including muscle activity recording and nerve conduction studies. It supports multiple electrode types, offers advanced signal amplification and filtering, and integrates with software for real-time visualization, analysis, and reporting.",
  "features": [
    "Adjustable signal amplification from 10 µV to 10 mV or higher",
    "Frequency response range from 2 Hz to 10 kHz for capturing motor unit action potentials and nerve conduction signals",
    "High sampling rate up to 200 kHz for precise event capture",
    "Supports 4 to 8 input channels for simultaneous muscle group monitoring",
    "Compatible with surface and needle electrodes",
    "Differential amplifiers for accurate electrical activity recording",
    "Supports nerve conduction studies with adjustable stimulus duration, intensity, and frequencies (1 Hz to 100 Hz)",
    "Paired software suite with real-time signal processing, automatic peak detection, quantitative analysis, and graphical tools",
    "High-resolution display with zoom and pan features for detailed signal analysis",
    "Intuitive clinical user interface with touchscreen or keyboard/mouse input",
    "Built-in safety features including overload protection and patient isolation",
    "Operates reliably in ambient temperatures from 10°C to 40°C and relative humidity between 20% and 80%",
    "Standard clinical power input (110-240 V, 50/60 Hz)"
  ],
  "specifications": {
    "amplification_range": "10 µV to 10 mV or higher",
    "frequency_response": "2 Hz to 10 kHz",
    "sampling_rate": "50 kHz to 200 kHz or higher",
    "input_channels": "4 to 8 channels",
    "electrode_types_supported": [
      "Surface electrodes",
      "Needle electrodes"
    ],
    "stimulus_types": "Square-wave pulses with adjustable duration and intensity",
    "stimulus_frequency_range": "1 Hz to 100 Hz",
    "software_features": [
      "Real-time signal processing and display",
      "Automatic peak detection and quantitative analysis",
      "Graphical analysis tools (amplitude, latency, waveform recognition)",
      "Data export options (CSV, PDF)"
    ],
    "display": "High-resolution with zoom and pan capabilities",
    "user_interface": "Touchscreen or keyboard/mouse",
    "safety_features": [
      "Overload protection",
      "Patient and equipment isolation during nerve conduction studies"
    ],
    "environmental_specs": {
      "temperature_range": "10°C to 40°C",
      "humidity_range": "20% to 80%"
    },
    "power_requirements": "110-240 V, 50/60 Hz",
    "clinical_applications": [
      "Diagnosis of neuromuscular disorders (e.g., myasthenia gravis, muscular dystrophies, neuropathies)",
      "Nerve conduction velocity (NCV) assessment",
      "Needle EMG for motor unit analysis",
      "Rehabilitation and sports medicine muscle activity assessment"
    ],
    "optional_upgrades": [
      "Modules for evoked potentials",
      "Sleep study diagnostics"
    ]
  }
},

  {
  name: "Medline Walker",
  description: "Durable and lightweight walker designed for enhanced mobility and stability, ideal for patients requiring walking assistance.",
  features: [
    "Lightweight aluminum frame",
    "Folding mechanism for easy transport",
    "Adjustable height settings",
    "Rubber tips for better grip",
    "Optional wheels for smoother movement"
  ],
  specifications: {
    frameMaterial: "Aluminum",
    weightCapacity: "300 lbs",
    adjustableHeight: {
      minHeight: "32 inches",
      maxHeight: "39 inches"
    },
    foldedDimensions: {
      width: "22 inches",
      depth: "5 inches"
    },
    color: "Silver",
    itemWeight: "6 lbs",
    warranty: "1 year"
  }
}
];

module.exports = { machine_Description };