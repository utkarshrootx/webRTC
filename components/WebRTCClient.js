import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import WebRTCClient from "../components/WebRTCClient"; // Adjust path if needed
import { setLocalStream, setError } from "../store/videoCallSlice";

jest.mock("react-native-webrtc", () => ({
  mediaDevices: {
    getUserMedia: jest.fn(() =>
      Promise.resolve({
        toURL: jest.fn(() => "mock-stream-url"),
      })
    ),
  },
  RTCPeerConnection: jest.fn(() => ({
    createOffer: jest.fn(() =>
      Promise.resolve({ type: "offer", sdp: "mock-sdp" })
    ),
    setLocalDescription: jest.fn(),
  })),
  RTCSessionDescription: jest.fn(),
  RTCView: jest.fn(() => null),
}));

jest.mock("expo-font", () => ({
  useFonts: () => [true],
}));

jest.mock("@react-navigation/native", () => ({
  ThemeProvider: ({ children }) => children,
  DarkTheme: {},
  DefaultTheme: {},
}));

const mockStore = configureStore([]);

describe("WebRTCClient Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      videoCall: { localStream: null, remoteStream: null },
    });
    store.dispatch = jest.fn();
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <Provider store={store}>
        <WebRTCClient />
      </Provider>
    );

    expect(getByText("Start Call")).toBeTruthy();
  });

  it("dispatches setLocalStream when stream starts", async () => {
    const { getByText } = render(
      <Provider store={store}>
        <WebRTCClient />
      </Provider>
    );

    fireEvent.press(getByText("Start Call"));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        setLocalStream(expect.any(Object))
      );
    });
  });

  it("handles error when getUserMedia fails", async () => {
    require("react-native-webrtc").mediaDevices.getUserMedia.mockRejectedValueOnce(
      new Error("Permission denied")
    );

    render(
      <Provider store={store}>
        <WebRTCClient />
      </Provider>
    );

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        setError("Permission denied")
      );
    });
  });
});
