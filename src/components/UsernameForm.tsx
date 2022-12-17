import React from "react";
import { useSetRecoilState } from "recoil";
import { usernameAtom } from "../store/roomInfo";

const UsernameForm = () => {
  const setUsername = useSetRecoilState(usernameAtom);
  return (
    <div className="min-h-full flex flex-col py-3">
      <div className={"flex h-full justify-center items-center"}>
        <div className="badge badge-lg">쫑탱 톡!</div>
      </div>
      <form
        onSubmit={(e: any) => {
          const value = e.target.username.value;
          e.preventDefault();
          setUsername(value);
          sessionStorage.setItem("username", value);
          e.target.username.value = "";
        }}
        className="flex"
      >
        <input
          type="text"
          className="input input-bordered input-info w-full"
          name={"username"}
          placeholder={"채팅에서 사용할 닉네임!"}
        />
        <button className="btn" type={"submit"}>
          입장
        </button>
      </form>
    </div>
  );
};

export default UsernameForm;
