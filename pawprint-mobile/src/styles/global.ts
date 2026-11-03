import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { sizes, scale } from "./sizes";


export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  centeredScreen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: sizes.screenPadding,
    justifyContent: "center",
  },

  title: {
    fontSize: sizes.title,
    fontWeight: "800",
    color: colors.brand,
    textAlign: "center",
  },

  subtitle: {
    fontSize: sizes.subtitle,
    color: colors.accentContrast,
    textAlign: "center",
  },

  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: sizes.borderRadius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: sizes.body,
  },

  brandButton: {
    backgroundColor: colors.brand,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  accentButton: {
    backgroundColor: colors.accent,
    height: sizes.buttonHeight,
    borderRadius: sizes.borderRadius,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: colors.tileBackground,
    borderRadius: sizes.cardRadius,
    padding: sizes.screenPadding,
    gap: 14,
  },

  backButton: {
    marginTop: 20,
    alignItems: "center",
  },

  loginInput: {
    width: "100%",
    maxWidth: 379,
    height: sizes.buttonHeight,
    backgroundColor: colors.inputBackground,
    borderRadius: sizes.borderRadius,
    paddingHorizontal: 16,
    fontSize: sizes.body,

    shadowColor: "#9c7f85",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  smallButton: {
    width: 160,
    height: sizes.buttonSmallHeight,
    backgroundColor: colors.brand,
    borderRadius: sizes.borderRadius,
    alignItems: "center",
    justifyContent: "center",
  },

  smallButtonText: {
    color: colors.white,
    fontWeight: "500",
  },

  bigButton: {
    width: "100%",
    maxWidth: 344,
    height: sizes.buttonHeight,
    backgroundColor: colors.brand,
    borderRadius: sizes.borderRadius,
    alignItems: "center",
    justifyContent: "center",
  },

  bigButtonText: {
    color: colors.white,
    fontSize: sizes.title,
    fontWeight: "700",
  },

  completeButton: {
    width: 46,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.brand,
    justifyContent: "center",
    alignItems: "center",
  },

  accentButtonText: {
    color: colors.accentContrast,
    fontSize: sizes.body,
    fontWeight: "700",
  },

  banner: {
    height: sizes.bannerHeight,
    width: "100%",
    backgroundColor: colors.bannerBackground,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: sizes.bannerPaddingBottom,
  },

  bannerLogo: {
    width: sizes.logoWidth,
    height: sizes.logoHeight,
    resizeMode: "contain",
  },

  bannerBackButton: {
    position: "absolute",
    left: sizes.iconOffset,
    bottom: 25,
  },

  itemText: {
    flex: 1,
    minWidth: 0,
  },

  content: {
    padding: sizes.screenPadding,
  },

  message: {
    color: colors.accent,
    textAlign: "center",
    marginBottom: scale(16),
  },

  cardHeaderText: {
    fontSize: sizes.menuText,
    color: colors.accentContrast,
    fontWeight: "700",
  },

  cardText: {
    fontSize: sizes.body,
    color: colors.accentContrast,
    fontWeight: "600",
    flexShrink: 1,
  },

  dashboardBulletRow: {
    flexDirection: "row",
    gap: scale(8),
    marginBottom: scale(10),
  },

  bullet: {
    fontSize: scale(32),
    color: colors.accent,
    top: -1,
  },

  dashboardItemDate: {
    fontSize: scale(14),
    color: colors.brand,
    marginTop: scale(2),
    fontWeight: "600",
  },

  deleteButton: {
    backgroundColor: colors.accent,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  deleteButtonText: {
    color: colors.accentContrast,
    fontWeight: "700",
  },

});