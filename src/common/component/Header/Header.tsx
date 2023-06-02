import React from "react";
import s from "common/component/Header/Header.module.scss";
import { Button } from "common/component/Button/Button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "common/hooks";
import { ProfilePhoto } from "common/component/Avatar/ProfilePhoto/ProfilePhoto";
export const Header = () => {
  const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn);
  const name = useAppSelector((state) => {
    if (state.auth.profile !== null) return state.auth.profile.name;
  });
  const navigate = useNavigate();
  const logoutButton = () => {
    return navigate("/login");
  };
  const onClickRedirectProfile = () => {
    return navigate("/");
  };

  return (
    <div className={s.header}>
      <div className={s.button}>
        {isLoggedIn ? (
          <div onClick={onClickRedirectProfile} className={s.loginAvatar}>
            <span>{name}</span>
            <ProfilePhoto />
          </div>
        ) : (
          <Button callback={logoutButton} name={"Sign in"} />
        )}
      </div>
    </div>
  );
};