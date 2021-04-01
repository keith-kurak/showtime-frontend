import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import mixpanel from "mixpanel-browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import AppContext from "../context/app-context";
import ClientOnlyPortal from "./ClientOnlyPortal";
import RecommendedFollowItem from "./RecommendedFollowItem";

const Backdrop = styled.div`
  z-index: 1;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Modal = styled.div`
  background-color: white;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 16px;
  left: 16px;
  padding: 1em;
  border-radius: 8px;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: scroll;
  margin-left: auto;
  margin-right: auto;
  color: black;
  @media screen and (max-width: 600px) {
    left: 3%;
    right: 3%;
    top: 2%;
    bottom: 2%;
    transform: translateY(0%);
    max-height: 100vh;
    //border-radius: 0px;
  }
`;

const Title = styled.h6`
  font-size: 24px;
  font-weight: 500;
  padding-bottom: 12px;
  width: 90%;
`;

const GraySeparator = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.11);
`;

const CloseIconWrapper = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  cursor: pointer;
  z-index: 4;
  background-color: black;
  padding: 6px;
  border-radius: 18px;
  width: 36px;
  height: 36px;
  opacity: 0.5;
  &:hover {
    opacity: 0.8;
  }
`;

const CloseIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  color: #fff;
`;

const RecommendFollowersVariants = {
  ONBOARDING: "ONBOARDING",
};

const RecommendFollowers = ({
  variant = RecommendFollowersVariants.ONBOARDING,
  items,
}) => {
  const context = useContext(AppContext);
  const [myFollows, setMyFollows] = useState([]);
  const [showAllItems, setShowAllItems] = useState(false);
  const [
    recommendFollowersModalOpen,
    setRecommendFollowersModalOpen,
  ] = useState(true);
  const removeAlreadyFollowedItems = items.filter(
    (item) => !myFollows.includes(item.profile_id)
  );
  const filteredItems = showAllItems
    ? removeAlreadyFollowedItems
    : removeAlreadyFollowedItems.slice(0, 3);
  const closeModal = async () => {
    await fetch(`/api/finishonboarding`, {
      method: "post",
    });
    context.setMyProfile({
      ...context.myProfile,
      has_onboarded: true,
    });
    setRecommendFollowersModalOpen(false);
  };
  useEffect(() => {
    setMyFollows(context?.myFollows?.map((follow) => follow?.profile_id) || []);
  }, []);
  useEffect(() => {
    if (
      items.length > 0 &&
      items.every((item) => myFollows.includes(item.profile_id))
    ) {
      closeModal();
    }
  }, [filteredItems]);
  if (variant === RecommendFollowersVariants.ONBOARDING) {
    return (
      recommendFollowersModalOpen && (
        <ClientOnlyPortal selector="#modal">
          <Backdrop onClick={() => closeModal()}>
            <Modal onClick={(e) => e.stopPropagation()}>
              <CloseIconWrapper
                onClick={() => {
                  mixpanel.track(
                    "Close Recommended Followers modal - x button"
                  );
                  closeModal();
                }}
              >
                <CloseIcon>
                  <FontAwesomeIcon icon={faTimes} />
                </CloseIcon>
              </CloseIconWrapper>
              <Title>
                {context.isMobile ? "Follow Suggestions" : "Follow Suggestions"}
              </Title>
              <GraySeparator />
              {filteredItems.map((item, index) => (
                <RecommendedFollowItem
                  key={item.profile_id}
                  item={item}
                  index={index}
                />
              ))}

              {!showAllItems && removeAlreadyFollowedItems.length > 3 && (
                <>
                  <div
                    className="text-center mx-auto px-6 py-2 my-4 flex items-center w-max border-2 rounded-full bg-stpink hover:text-stpink hover:bg-white text-white border-stpink  cursor-pointer"
                    onClick={() => {
                      setShowAllItems(true);
                    }}
                  >
                    {"Show More"}
                    <FontAwesomeIcon
                      style={{ height: 14, marginLeft: 8 }}
                      icon={faArrowDown}
                    />
                  </div>
                  <GraySeparator />
                </>
              )}

              <div
                className="float-right px-6 py-2 mt-4 flex items-center w-max border-2 border-gray-300 rounded-full hover:text-stpink hover:border-stpink cursor-pointer"
                onClick={() => {
                  mixpanel.track(
                    "Close Recommended Followers modal - bottom button"
                  );
                  closeModal();
                }}
              >
                {"Close"}
              </div>
            </Modal>
          </Backdrop>
        </ClientOnlyPortal>
      )
    );
  }
  return null;
};

export default RecommendFollowers;
