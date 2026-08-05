import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react-native";
import { ReactNode, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import useOnboardingController from "./useOnboardingController";

type FloatingTileProps = {
  emoji: string;
  position: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  rotation: number;
  delay: number;
};

type FeatureProps = {
  icon: ReactNode;
  label: string;
};

const PRODUCT_EMOJIS = ["🥑", "🍅", "🐟", "🥖"];

const WelcomeScreen = () => {
  const { width, height } = useWindowDimensions();
  const { functions } = useOnboardingController();

  const content_width = Math.min(width, 480);
  const illustration_height = Math.min(380, height * 0.42);

  return (
    <SafeAreaView style={styles.safe_area}>
      <View style={styles.screen}>
        <View
          style={[
            styles.container,
            {
              width: content_width,
            },
          ]}
        >
          <AmbientBackground />

          <Animated.View entering={FadeInDown.duration(650)} style={styles.header}>
            <View style={styles.brand_container}>
              <LinearGradient
                colors={["#10B981", "#0D9488"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.brand_logo}
              >
                <Text style={styles.brand_logo_text}>F</Text>
              </LinearGradient>

              <Text style={styles.brand_name}>Martify</Text>
            </View>

            <Pressable
              onPress={functions.signIn}
              hitSlop={12}
              style={({ pressed }) => [styles.skip_button, pressed && styles.button_pressed]}
            >
              <Text style={styles.skip_text}>Skip</Text>
            </Pressable>
          </Animated.View>

          <View style={styles.main_content}>
            <View
              style={[
                styles.illustration_container,
                {
                  height: illustration_height,
                },
              ]}
            >
              <FloatingTile
                emoji="🥑"
                position={{
                  top: 4,
                  left: 16,
                }}
                rotation={-8}
                delay={0}
              />

              <FloatingTile
                emoji="🍓"
                position={{
                  top: 12,
                  right: 24,
                }}
                rotation={10}
                delay={400}
              />

              <FloatingTile
                emoji="🥖"
                position={{
                  top: 160,
                  left: 48,
                }}
                rotation={6}
                delay={800}
              />

              <FloatingTile
                emoji="🥛"
                position={{
                  top: 208,
                  right: 16,
                }}
                rotation={-6}
                delay={200}
              />

              <FloatingTile
                emoji="🍅"
                position={{
                  bottom: 32,
                  left: 24,
                }}
                rotation={12}
                delay={600}
              />

              <FloatingTile
                emoji="🐟"
                position={{
                  bottom: 64,
                  right: 56,
                }}
                rotation={-10}
                delay={1000}
              />

              <MealPlanCard />
            </View>

            <Animated.View entering={FadeInUp.delay(200).duration(700)} style={styles.introduction}>
              <Text style={styles.heading}>
                Groceries that <Text style={styles.heading_highlight}>think ahead</Text>.
              </Text>

              <Text style={styles.description}>
                Personalized picks, budget-aware planning, and same-day delivery — all guided by AI
                you actually want to talk to.
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(350).duration(700)}
              style={styles.features_container}
            >
              <Feature icon={<Sparkles size={16} color="#047857" />} label="AI picks" />

              <Feature icon={<Zap size={16} color="#047857" />} label="60-min delivery" />

              <Feature icon={<ShieldCheck size={16} color="#047857" />} label="Freshness promise" />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(500).duration(700)}
              style={styles.actions_container}
            >
              <Pressable
                onPress={functions.getStarted}
                style={({ pressed }) => [
                  styles.primary_button,
                  pressed && styles.primary_button_pressed,
                ]}
              >
                <Text style={styles.primary_button_text}>Get started</Text>
                <ArrowRight size={17} color="#FFFFFF" />
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const AmbientBackground = () => {
  const animation_progress = useSharedValue(0);

  useEffect(() => {
    animation_progress.value = withRepeat(
      withTiming(1, {
        duration: 7000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [animation_progress]);

  const top_gradient_style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(animation_progress.value, [0, 1], [0, -18]),
        },
        {
          translateY: interpolate(animation_progress.value, [0, 1], [0, 16]),
        },
        {
          scale: interpolate(animation_progress.value, [0, 1], [1, 1.08]),
        },
      ],
    };
  });

  const left_gradient_style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(animation_progress.value, [0, 1], [0, 16]),
        },
        {
          translateY: interpolate(animation_progress.value, [0, 1], [0, -12]),
        },
        {
          scale: interpolate(animation_progress.value, [0, 1], [1.05, 0.96]),
        },
      ],
    };
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.top_ambient_wrapper, top_gradient_style]}>
        <LinearGradient
          colors={[
            "rgba(110, 231, 183, 0.48)",
            "rgba(167, 243, 208, 0.15)",
            "rgba(255, 255, 255, 0)",
          ]}
          style={styles.ambient_gradient}
        />
      </Animated.View>

      <Animated.View style={[styles.left_ambient_wrapper, left_gradient_style]}>
        <LinearGradient
          colors={[
            "rgba(217, 249, 157, 0.55)",
            "rgba(236, 252, 203, 0.18)",
            "rgba(255, 255, 255, 0)",
          ]}
          style={styles.ambient_gradient}
        />
      </Animated.View>
    </View>
  );
};

const FloatingTile = ({ emoji, position, rotation, delay }: FloatingTileProps) => {
  const animation_progress = useSharedValue(0);

  useEffect(() => {
    animation_progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );
  }, [animation_progress, delay]);

  const animated_style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(animation_progress.value, [0, 1], [0, -8]),
        },
        {
          rotate: `${interpolate(animation_progress.value, [0, 1], [rotation, rotation + 2])}deg`,
        },
        {
          scale: interpolate(animation_progress.value, [0, 1], [1, 1.025]),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.floating_tile, position, animated_style]}>
      <Text style={styles.floating_tile_emoji}>{emoji}</Text>
    </Animated.View>
  );
};

const MealPlanCard = () => {
  const animation_progress = useSharedValue(0);

  useEffect(() => {
    animation_progress.value = withRepeat(
      withTiming(1, {
        duration: 3500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [animation_progress]);

  const animated_style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(animation_progress.value, [0, 1], [0, -5]),
        },
        {
          scale: interpolate(animation_progress.value, [0, 1], [1, 1.015]),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.meal_plan_card, animated_style]}>
      <View style={styles.meal_plan_label_container}>
        <Sparkles size={14} color="#047857" />
        <Text style={styles.meal_plan_label}>AI meal plan ready</Text>
      </View>

      <Text style={styles.meal_plan_title}>Mediterranean week for 2 · $84.20 · 12 items</Text>

      <View style={styles.product_avatar_container}>
        {PRODUCT_EMOJIS.map((emoji, index) => (
          <View
            key={`${emoji}-${index}`}
            style={[styles.product_avatar, index > 0 && styles.product_avatar_overlap]}
          >
            <Text style={styles.product_avatar_emoji}>{emoji}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const Feature = ({ icon, label }: FeatureProps) => {
  return (
    <View style={styles.feature_card}>
      <View style={styles.feature_icon}>{icon}</View>

      <Text numberOfLines={2} adjustsFontSizeToFit style={styles.feature_label}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safe_area: {
    flex: 1,
    backgroundColor: "#F8FAF7",
  },

  screen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F8FAF7",
  },

  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },

  top_ambient_wrapper: {
    position: "absolute",
    top: -160,
    right: -96,
    width: 384,
    height: 384,
    borderRadius: 192,
    overflow: "hidden",
  },

  left_ambient_wrapper: {
    position: "absolute",
    top: 160,
    left: -128,
    width: 384,
    height: 384,
    borderRadius: 192,
    overflow: "hidden",
  },

  ambient_gradient: {
    flex: 1,
    borderRadius: 192,
  },

  header: {
    zIndex: 10,
    paddingHorizontal: 24,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  brand_logo: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#059669",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 6,
  },

  brand_logo_text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  brand_name: {
    color: "#18231D",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  skip_button: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },

  skip_text: {
    color: "#69756D",
    fontSize: 14,
    fontWeight: "600",
  },

  main_content: {
    zIndex: 5,
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },

  illustration_container: {
    position: "relative",
    marginBottom: 20,
  },

  floating_tile: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EEE9",
    shadowColor: "#1D3829",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 7,
  },

  floating_tile_emoji: {
    fontSize: 38,
  },

  meal_plan_card: {
    position: "absolute",
    top: 96,
    left: "50%",
    width: 224,
    marginLeft: -112,
    padding: 16,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EBE6",
    shadowColor: "#12291B",
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  },

  meal_plan_label_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  meal_plan_label: {
    color: "#047857",
    fontSize: 12,
    fontWeight: "700",
  },

  meal_plan_title: {
    marginTop: 8,
    color: "#17211B",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },

  product_avatar_container: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  product_avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5EF",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  product_avatar_overlap: {
    marginLeft: -8,
  },

  product_avatar_emoji: {
    fontSize: 14,
  },

  introduction: {
    gap: 12,
  },

  heading: {
    color: "#152019",
    fontSize: 34,
    lineHeight: 37,
    fontWeight: "800",
    letterSpacing: -1.2,
  },

  heading_highlight: {
    color: "#079669",
  },

  description: {
    color: "#68746C",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },

  features_container: {
    marginTop: 26,
    flexDirection: "row",
    gap: 8,
  },

  feature_card: {
    flex: 1,
    minHeight: 86,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5ECE7",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  feature_icon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDF7E9",
  },

  feature_label: {
    color: "#202B24",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
  },

  actions_container: {
    marginTop: 26,
    gap: 8,
  },

  primary_button: {
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#079669",
    shadowColor: "#047857",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.28,
    shadowRadius: 15,
    elevation: 7,
  },

  primary_button_pressed: {
    opacity: 0.88,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  primary_button_text: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  guest_button: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  guest_button_text: {
    color: "#68746C",
    fontSize: 14,
    fontWeight: "600",
  },

  button_pressed: {
    opacity: 0.6,
  },
});

export default WelcomeScreen;
