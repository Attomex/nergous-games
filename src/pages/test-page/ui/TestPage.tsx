import { SyncIcon } from "widgets/icons";
import "./TestPage.css";

export const TestPage = () => {


    return (
        <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "10px" }}  className={"button"}><SyncIcon spin/>test</button>
            <button className={"button button__default"}>def</button>
            <button className={"button button__cancel"}>cancel</button>
            <button className={"button button__delete"}>test</button>
            <button className={"button button__submit"}>test</button>
        </div>
    );
};
