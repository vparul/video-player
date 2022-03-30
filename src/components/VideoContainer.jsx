import React, { useEffect, useRef, useState } from "react";
import useVideoPlayer from "../hooks/useVideoPlayer";
import video from "../assets/nature.mp4";
import playButton from "../assets/icons/play.png";
import pauseButton from "../assets/icons/pause-button.png";
import volumeFull from "../assets/icons/sound-on.png";
import volumeMute from "../assets/icons/sound-off.png";

export default function VideoContainer() {
  const videoElement = useRef(null);
  const {
    playerState,
    setPlayerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
  } = useVideoPlayer(videoElement);
  const [addListener, setAddListener] = useState(null);

  const objMapping = {
    1: "bottomLeft",
    2: "topLeft",
    3: "topRight",
    4: "bottomRight",
  };
  const [inContainer, setInContainer] = useState(objMapping[1]);

  useEffect(() => {
    setPlayerState({
      isPlaying: false,
      progress: 0,
      speed: 1,
      isMuted: false,
    });
  }, [inContainer]);

  useEffect(() => {
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [addListener]);

  const onKeyUp = (e) => {
    if (e.code === "Space") {
      togglePlay();
      setAddListener(!addListener);
    }
    if (e.code === "KeyM") {
      toggleMute();
      setAddListener(!addListener);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("progress", playerState.progress);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    e.stopPropagation();
    category !== inContainer && setInContainer(category);
    e.dataTransfer.clearData();
  };

  const renderVideo = () => {
    return (
      <div className={`${(inContainer === objMapping[2] || (inContainer === objMapping[3])) ? ' video-parent items-top': 'video-parent'}`}>
        <div className="video-container">
          <div className="video-wrapper h-100 w-100 transition">
            <div draggable onDragStart={(e) => handleDragStart(e)}>
              <video
                className="h-100 w-100 transition"
                src={video}
                ref={videoElement}
                onTimeUpdate={handleOnTimeUpdate}
              />
            </div>
            <div className="controls-container">
              <div className="controls">
                <div className="actions">
                  <span className="action-btns" onClick={togglePlay}>
                    {!playerState.isPlaying ? (
                      <img className="image" src={playButton} alt="play" />
                    ) : (
                      <img className="image" src={pauseButton} alt="pause" />
                    )}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={playerState.progress}
                  onChange={(e) => handleVideoProgress(e)}
                />
                <div>
                  <select
                    className="velocity"
                    value={playerState.speed}
                    onChange={(e) => handleVideoSpeed(e)}
                  >
                    <option value="0.50" className="option">0.50x</option>
                    <option value="1" className="option">1x</option>
                    <option value="1.25" className="option">1.25x</option>
                    <option value="2" className="option">2x</option>
                  </select>
                  <span className="action-btns" onClick={toggleMute}>
                    {!playerState.isMuted ? (
                      <img
                        className="image"
                        src={volumeFull}
                        alt="volume-full"
                      />
                    ) : (
                      <img
                        className="image"
                        src={volumeMute}
                        alt="volume-mute"
                      />
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="droppable-container1"
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e, objMapping[1])}
      >
        {inContainer === objMapping[1] && renderVideo()}
      </div>
      <div
        className="droppable-container2"
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e, objMapping[2])}
      >
        {inContainer === objMapping[2] && renderVideo()}
      </div>
      <div
        className="droppable-container3"
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e, objMapping[3])}
      >
        {inContainer === objMapping[3] && renderVideo()}
      </div>
      <div
        className="droppable-container4"
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e, objMapping[4])}
      >
        {inContainer === objMapping[4] && renderVideo()}
      </div>
    </>
  );
}
