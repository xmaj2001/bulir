import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { useState, useEffect } from "react";

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
}

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  disableDrag = false,
}: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  if (disableDrag) {
    return (
      <motion.div
        className="absolute inset-0 cursor-pointer"
        style={{ x: 0, y: 0 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

// ✅ Tipo atualizado para incluir randomRotate estável por card
interface StackCard {
  id: number;
  content: React.ReactNode;
  randomRotate: number;
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  cards?: React.ReactNode[];
  animationConfig?: { stiffness: number; damping: number };
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
}

// ✅ Helper puro fora do componente — gera o randomRotate uma vez, na inicialização
function buildStack(items: React.ReactNode[]): StackCard[] {
  return items.map((content, index) => ({
    id: index + 1,
    content,
    randomRotate: Math.random() * 10 - 5, // seguro aqui: fora do render
  }));
}

const DEFAULT_CARDS: React.ReactNode[] = [
  <img
    src="/images/mockup/app.png"
    alt="card-1"
    className="w-full h-full object-contain pointer-events-none rounded-3xl"
  />,
  <img
    src="/images/mockup/app1.png"
    alt="card-2"
    className="w-full h-full object-contain pointer-events-none rounded-3xl"
  />,
  <img
    src="/images/mockup/app2.png"
    alt="card-3"
    className="w-full h-full object-contain pointer-events-none rounded-3xl"
  />,
  <img
    src="/images/mockup/app3.png"
    alt="card-4"
    className="w-full h-full object-contain pointer-events-none rounded-3xl"
  />,
];

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
}: StackProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

  // ✅ randomRotate calculado uma vez na inicialização do estado — fora do render
  const [stack, setStack] = useState<StackCard[]>(() =>
    buildStack(cards.length ? cards : DEFAULT_CARDS),
  );

  // ✅ Quando o prop `cards` muda, recalcula o stack com novos randomRotate
  useEffect(() => {
    if (cards.length) {
      setStack(buildStack(cards));
    }
  }, [cards]);

  const sendToBack = (id: number) => {
    setStack((prev) => {
      const newStack = [...prev];
      const index = newStack.findIndex((card) => card.id === id);
      const [card] = newStack.splice(index, 1);
      newStack.unshift(card);
      return newStack;
    });
  };

  useEffect(() => {
    if (autoplay && stack.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        const topCardId = stack[stack.length - 1].id;
        sendToBack(topCardId);
      }, autoplayDelay);

      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, stack, isPaused]);

  return (
    <div
      className="relative w-full h-full"
      style={{ perspective: 600 }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {stack.map((card, index) => {
        // ✅ Usa o valor estável do estado — sem Math.random() no render!
        const randomRotate = randomRotation ? card.randomRotate : 0;

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
          >
            <motion.div
              className="rounded-2xl overflow-hidden w-auto h-full"
              onClick={() => shouldEnableClick && sendToBack(card.id)}
              animate={{
                rotateZ: (stack.length - index - 1) * 4 + randomRotate,
                scale: 1 + index * 0.06 - stack.length * 0.06,
                transformOrigin: "90% 90%",
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
            >
              <div
                // initial={{ opacity: 0, scale: 0 }}
                // animate={{ opacity: 1, scale: 1 }}
                // transition={{ delay: 1.2, type: "spring" }}
                className="w-fit h-full cursor-target"
              >
                {card.content}
              </div>
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
