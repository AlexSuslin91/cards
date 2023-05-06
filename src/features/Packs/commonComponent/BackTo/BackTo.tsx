import React, { FC } from "react";
import s from "./BackTo.module.scss";
import { useNavigate } from "react-router-dom";
import arrow from "../../../../common/Image/Vector 1.svg";
type BackToType = {
  name: string;
  link: string;
};
export const BackTo: FC<BackToType> = ({ name, link }) => {
  const navigate = useNavigate();
  const onClickHandler = () => {
    return navigate(link);
  };
  return (
    <div className={s.contLink}>
      <img src={arrow} alt="" />
      <span className={s.link} onClick={onClickHandler}>
        {name}
      </span>
    </div>
  );
};
