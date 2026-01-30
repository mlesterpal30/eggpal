import { useState, useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

import egglogo from "../assets/egglogo.png";

type LogoLoaderProps = {
  onComplete: () => void;
};

const DURATION_MS = 5000;

// Timeline (ms): 0-1000 clear | 1000 text slide up (600ms) | 1600 image fade in (500ms) | 2100-5000 image rotates
const TEXT_START = 1000;
const TEXT_DURATION = 0.6;
const IMAGE_FADE_START = 1600; // after text is in place
const IMAGE_FADE_DURATION = 0.5;
const ROTATE_START = 1850; // when image is visible
const ROTATE_DURATION = (DURATION_MS - ROTATE_START) / 1000; // ~2.9s
const ROTATE_DEGREES = 180; // slower: less rotation in same time

const LogoLoader = ({ onComplete }: LogoLoaderProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isExiting) {
      onComplete();
    }
  }, [isExiting, onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
  };

  if (isExiting) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      <Flex direction="column" alignItems="center" justifyContent="center" gap={0}>
        {/* Image: fade in after text, then rotate for the rest of the 5s */}
        <motion.img
          src={egglogo}
          alt="EggPal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: ROTATE_DEGREES }}
          transition={{
            opacity: {
              delay: IMAGE_FADE_START / 1000,
              duration: IMAGE_FADE_DURATION,
            },
            rotate: {
              delay: ROTATE_START / 1000,
              duration: ROTATE_DURATION,
              ease: "linear",
            },
          }}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: 600,
            maxHeight: 320,
            objectFit: "contain",
            background: "transparent",
          }}
        />
        {/* Text: from bottom to position, starts at 1s */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: TEXT_START / 1000,
            duration: TEXT_DURATION,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -66 }}
        >
          <Text fontSize="6xl" color="black" fontFamily="rubik">
            EGGPAL
          </Text>
          <Text mt={-6} fontSize="4xl" fontWeight="semibold" color="black" fontFamily="geist">
            FARM
          </Text>
        </motion.div>
      </Flex>

      <motion.button
        type="button"
        onClick={handleSkip}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 2 }}
        whileHover={{ opacity: 1 }}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          padding: "8px 16px",
          fontSize: 14,
          color: "#333",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        Skip
      </motion.button>
    </div>
  );
};

export default LogoLoader;
