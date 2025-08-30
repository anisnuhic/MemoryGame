import { Union, Record } from "./fable_modules/fable-library-js.4.25.0/Types.js";
import { union_type, record_type, int32_type, bool_type, string_type } from "./fable_modules/fable-library-js.4.25.0/Reflection.js";
import { int32ToString, createObj, disposeSafe, getEnumerator, comparePrimitives, createAtom } from "./fable_modules/fable-library-js.4.25.0/Util.js";
import { singleton as singleton_2, forAll, item, sortBy, ofArray } from "./fable_modules/fable-library-js.4.25.0/List.js";
import { singleton } from "./fable_modules/fable-library-js.4.25.0/AsyncBuilder.js";
import { start, sleep } from "./fable_modules/fable-library-js.4.25.0/Async.js";
import { nonSeeded } from "./fable_modules/fable-library-js.4.25.0/Random.js";
import { Cmd_ofEffect, Cmd_none } from "./fable_modules/Fable.Elmish.4.0.0/cmd.fs.js";
import { singleton as singleton_1, append, delay as delay_1, toList } from "./fable_modules/fable-library-js.4.25.0/Seq.js";
import { rangeDouble } from "./fable_modules/fable-library-js.4.25.0/Range.js";
import { createElement } from "react";
import { Interop_reactApi } from "./fable_modules/Feliz.2.7.0/Interop.fs.js";
import { ProgramModule_mkProgram, ProgramModule_run } from "./fable_modules/Fable.Elmish.4.0.0/program.fs.js";
import { Program_withReactSynchronous } from "./fable_modules/Fable.Elmish.React.4.0.0/react.fs.js";

export const Image1 = "images/1.png";

export const Image2 = "images/2.png";

export const Image3 = "images/3.png";

export const Image4 = "images/4.png";

export const Image5 = "images/5.png";

export const Image6 = "images/6.png";

export class Cell extends Record {
    constructor(image, isThere, Clicks) {
        super();
        this.image = image;
        this.isThere = isThere;
        this.Clicks = (Clicks | 0);
    }
}

export function Cell_$reflection() {
    return record_type("Program.Cell", [], Cell, () => [["image", string_type], ["isThere", bool_type], ["Clicks", int32_type]]);
}

export let Cells = createAtom(ofArray([new Cell(Image1, true, 0), new Cell(Image2, true, 0), new Cell(Image3, true, 0), new Cell(Image4, true, 0), new Cell(Image5, true, 0), new Cell(Image6, true, 0), new Cell(Image1, true, 0), new Cell(Image2, true, 0), new Cell(Image3, true, 0), new Cell(Image4, true, 0), new Cell(Image5, true, 0), new Cell(Image6, true, 0)]));

export class State extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Initial", "AllClosed", "OneOpened", "TwoOpened", "GameOver"];
    }
}

export function State_$reflection() {
    return union_type("Program.State", [], State, () => [[], [["Item1", int32_type], ["Item2", int32_type]], [["Item1", int32_type], ["Item2", int32_type], ["Item3", int32_type]], [["Item1", int32_type], ["Item2", int32_type], ["Item3", int32_type], ["Item4", int32_type]], [["Item", int32_type]]]);
}

export class Message extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Start", "ImageClick", "Restart", "TimerMessage", "Close"];
    }
}

export function Message_$reflection() {
    return union_type("Program.Message", [], Message, () => [[], [["Item", int32_type]], [], [], []]);
}

export function timer(dispatch) {
    return singleton.Delay(() => singleton.Bind(sleep(1000), () => {
        dispatch(new Message(3, []));
        return singleton.Zero();
    }));
}

export function delay(dispatch) {
    start(timer(dispatch));
}

export function close750(dispatch) {
    return singleton.Delay(() => singleton.Bind(sleep(750), () => {
        dispatch(new Message(4, []));
        return singleton.Zero();
    }));
}

export function delayClose750(dispatch) {
    start(close750(dispatch));
}

export function close1500(dispatch) {
    return singleton.Delay(() => singleton.Bind(sleep(1500), () => {
        dispatch(new Message(4, []));
        return singleton.Zero();
    }));
}

export function delayClose1500(dispatch) {
    start(close750(dispatch));
}

export function init() {
    const random = nonSeeded();
    Cells(sortBy((_arg) => random.Next0(), Cells(), {
        Compare: comparePrimitives,
    }));
    return [new State(0, []), Cmd_none()];
}

export function points(i, j) {
    let x, x_2;
    let a;
    const matchValue = item(i, Cells()).Clicks | 0;
    if ((x = (matchValue | 0), x < 3)) {
        const x_1 = matchValue | 0;
        a = 10;
    }
    else {
        a = ((matchValue === 3) ? 5 : ((matchValue === 4) ? 2 : 0));
    }
    let b;
    const matchValue_1 = item(j, Cells()).Clicks | 0;
    if ((x_2 = (matchValue_1 | 0), x_2 < 3)) {
        const x_3 = matchValue_1 | 0;
        b = 10;
    }
    else {
        b = ((matchValue_1 === 3) ? 5 : ((matchValue_1 === 4) ? 2 : 0));
    }
    return (a + b) | 0;
}

export function isEnd() {
    return forAll((x) => (x.isThere === false), Cells());
}

export function update(msg, state) {
    switch (state.tag) {
        case 1: {
            const t = state.fields[0] | 0;
            const b = state.fields[1] | 0;
            if (isEnd() ? true : (t === 0)) {
                return [new State(4, [b]), Cmd_none()];
            }
            else {
                switch (msg.tag) {
                    case 3:
                        return [new State(1, [t - 1, b]), Cmd_ofEffect((dispatch_1) => {
                            delay(dispatch_1);
                        })];
                    case 1: {
                        const i = msg.fields[0] | 0;
                        item(i, Cells()).Clicks = ((item(i, Cells()).Clicks + 1) | 0);
                        return [new State(2, [t, i, b]), Cmd_none()];
                    }
                    default:
                        return [state, Cmd_none()];
                }
            }
        }
        case 2: {
            const t_1 = state.fields[0] | 0;
            const i_1 = state.fields[1] | 0;
            const b_1 = state.fields[2] | 0;
            if (t_1 === 0) {
                return [new State(4, [b_1]), Cmd_none()];
            }
            else {
                switch (msg.tag) {
                    case 3:
                        return [new State(2, [t_1 - 1, i_1, b_1]), Cmd_ofEffect((dispatch_2) => {
                            delay(dispatch_2);
                        })];
                    case 1: {
                        const j = msg.fields[0] | 0;
                        if (i_1 === j) {
                            return [state, Cmd_none()];
                        }
                        else {
                            item(j, Cells()).Clicks = ((item(j, Cells()).Clicks + 1) | 0);
                            if (item(i_1, Cells()).image === item(j, Cells()).image) {
                                item(i_1, Cells()).isThere = false;
                                item(j, Cells()).isThere = false;
                                const bodovi = points(i_1, j) | 0;
                                return [new State(3, [t_1, i_1, j, b_1 + bodovi]), Cmd_ofEffect((dispatch_3) => {
                                    delayClose1500(dispatch_3);
                                })];
                            }
                            else {
                                return [new State(3, [t_1, i_1, j, b_1]), Cmd_ofEffect((dispatch_4) => {
                                    delayClose750(dispatch_4);
                                })];
                            }
                        }
                    }
                    default:
                        return [state, Cmd_none()];
                }
            }
        }
        case 3: {
            const t_2 = state.fields[0] | 0;
            const j_1 = state.fields[2] | 0;
            const i_2 = state.fields[1] | 0;
            const b_2 = state.fields[3] | 0;
            if (t_2 === 0) {
                return [new State(4, [b_2]), Cmd_none()];
            }
            else {
                switch (msg.tag) {
                    case 4:
                        return [new State(1, [t_2, b_2]), Cmd_none()];
                    case 3:
                        return [new State(3, [t_2 - 1, i_2, j_1, b_2]), Cmd_ofEffect((dispatch_5) => {
                            delay(dispatch_5);
                        })];
                    default:
                        return [state, Cmd_none()];
                }
            }
        }
        case 4: {
            const b_3 = state.fields[0] | 0;
            const random = nonSeeded();
            Cells(sortBy((_arg) => random.Next0(), Cells(), {
                Compare: comparePrimitives,
            }));
            const enumerator = getEnumerator(toList(rangeDouble(0, 1, 11)));
            try {
                while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                    const i_3 = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]() | 0;
                    item(i_3, Cells()).isThere = true;
                    item(i_3, Cells()).Clicks = 0;
                }
            }
            finally {
                disposeSafe(enumerator);
            }
            if (msg.tag === 2) {
                return [new State(1, [30, 0]), Cmd_ofEffect((dispatch_6) => {
                    delay(dispatch_6);
                })];
            }
            else {
                return [state, Cmd_none()];
            }
        }
        default:
            if (msg.tag === 0) {
                return [new State(1, [30, 0]), Cmd_ofEffect((dispatch) => {
                    delay(dispatch);
                })];
            }
            else {
                return [state, Cmd_none()];
            }
    }
}

export function ShowCell(dispatch, i, state) {
    return createElement("img", createObj(toList(delay_1(() => append(singleton_1(["style", {
        width: 150,
        height: 150,
        margin: 10,
        borderRadius: 10,
    }]), delay_1(() => {
        let n;
        const matchValue = state;
        let matchResult, n_1, m, n_2;
        switch (matchValue.tag) {
            case 1: {
                if (item(i, Cells()).isThere) {
                    matchResult = 0;
                }
                else {
                    matchResult = 3;
                }
                break;
            }
            case 2: {
                if ((n = (matchValue.fields[1] | 0), item(i, Cells()).isThere)) {
                    matchResult = 1;
                    n_1 = matchValue.fields[1];
                }
                else {
                    matchResult = 3;
                }
                break;
            }
            case 3: {
                matchResult = 2;
                m = matchValue.fields[2];
                n_2 = matchValue.fields[1];
                break;
            }
            default:
                matchResult = 3;
        }
        switch (matchResult) {
            case 0:
                return append(singleton_1(["src", "images/black.png"]), delay_1(() => singleton_1(["onClick", (_arg) => {
                    dispatch(new Message(1, [i]));
                }])));
            case 1:
                return append((n_1 === i) ? singleton_1(["src", item(i, Cells()).image]) : singleton_1(["src", "images/black.png"]), delay_1(() => singleton_1(["onClick", (_arg_1) => {
                    dispatch(new Message(1, [i]));
                }])));
            case 2:
                return ((n_2 === i) ? true : (m === i)) ? singleton_1(["src", item(i, Cells()).image]) : (item(i, Cells()).isThere ? singleton_1(["src", "images/black.png"]) : singleton_1(["src", "images/white.png"]));
            default:
                return append(singleton_1(["src", "images/white.png"]), delay_1(() => singleton_1(["style", {
                    width: 150,
                    height: 150,
                    margin: 10,
                }])));
        }
    }))))));
}

export function show(state, dispatch, t, b) {
    let elems_6, elems;
    return createElement("div", createObj(ofArray([["style", {
        backgroundImage: "url(\'images/jungle.png\')",
        backgroundSize: "contain",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        margin: -10,
        height: 800,
    }], (elems_6 = [createElement("div", createObj(ofArray([["style", {
        marginTop: -100,
        width: 300,
        height: 70,
        backgroundColor: "#378BBA",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        borderRadius: 50,
        boxShadow: (((5 + "px ") + 5) + "px ") + "#30B9DB",
    }], (elems = [createElement("label", {
        children: "Time remaining:  " + int32ToString(t),
        style: {
            color: "white",
            fontSize: 20 + "px",
            fontFamily: "Calibri",
        },
    }), createElement("label", {
        children: "Score:  " + int32ToString(b),
        style: {
            color: "white",
            fontSize: 20 + "px",
            fontFamily: "Calibri",
        },
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])]))), createElement("br", {}), createElement("div", createObj(toList(delay_1(() => append(singleton_1(["style", {
        backgroundColor: "#378BBA",
        width: 700,
        height: 520,
        padding: 20,
        borderStyle: "dotted",
        borderRadius: 20,
        borderColor: "#30B9DB",
        borderWidth: 6,
        justifyContent: "center",
        alignItems: "center",
    }]), delay_1(() => {
        let elems_2, elems_1, elems_5, elems_4, elems_3;
        return (state.tag === 0) ? singleton_1((elems_2 = [createElement("div", createObj(ofArray([["style", {
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            alignItems: "center",
        }], (elems_1 = [createElement("button", {
            style: {
                width: 200,
                height: 100,
                borderRadius: 50,
                fontSize: 40 + "px",
                borderColor: "#30B9DB",
                borderWidth: 6,
                color: "#378BBA",
                fontFamily: "Calibri",
                marginTop: 200,
            },
            children: "START",
            onClick: (_arg) => {
                dispatch(new Message(0, []));
            },
        })], ["children", Interop_reactApi.Children.toArray(Array.from(elems_1))])])))], ["children", Interop_reactApi.Children.toArray(Array.from(elems_2))])) : singleton_1((elems_5 = [createElement("div", createObj(ofArray([["style", {
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
        }], (elems_4 = [createElement("div", createObj(singleton_2((elems_3 = [ShowCell(dispatch, 0, state), ShowCell(dispatch, 1, state), ShowCell(dispatch, 2, state), ShowCell(dispatch, 3, state), createElement("br", {}), ShowCell(dispatch, 4, state), ShowCell(dispatch, 5, state), ShowCell(dispatch, 6, state), ShowCell(dispatch, 7, state), createElement("br", {}), ShowCell(dispatch, 8, state), ShowCell(dispatch, 9, state), ShowCell(dispatch, 10, state), ShowCell(dispatch, 11, state)], ["children", Interop_reactApi.Children.toArray(Array.from(elems_3))]))))], ["children", Interop_reactApi.Children.toArray(Array.from(elems_4))])])))], ["children", Interop_reactApi.Children.toArray(Array.from(elems_5))]));
    }))))))], ["children", Interop_reactApi.Children.toArray(Array.from(elems_6))])])));
}

export function render(state, dispatch) {
    let elems_3, elems, elems_1, elems_2;
    switch (state.tag) {
        case 1: {
            const t = state.fields[0] | 0;
            const b = state.fields[1] | 0;
            return show(state, dispatch, t, b);
        }
        case 2: {
            const t_1 = state.fields[0] | 0;
            const i = state.fields[1] | 0;
            const b_1 = state.fields[2] | 0;
            return show(state, dispatch, t_1, b_1);
        }
        case 3: {
            const t_2 = state.fields[0] | 0;
            const j = state.fields[2] | 0;
            const i_1 = state.fields[1] | 0;
            const b_2 = state.fields[3] | 0;
            return show(state, dispatch, t_2, b_2);
        }
        case 4: {
            const b_3 = state.fields[0] | 0;
            return createElement("div", createObj(ofArray([["style", {
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                padding: 20,
            }], (elems_3 = [createElement("br", {}), createElement("div", createObj(ofArray([["style", {
                width: 200,
                height: 70,
                backgroundColor: "#378BBA",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                padding: 5,
                borderRadius: 50,
                borderStyle: "dotted",
                borderColor: "#30B9DB",
                padding: 100,
            }], (elems = [createElement("img", {
                src: "images/gameover.png",
                width: 600,
                height: 500,
                style: {
                    padding: 40,
                },
            })], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])]))), createElement("br", {}), createElement("div", createObj(ofArray([["style", {
                width: 200,
                height: 70,
                backgroundColor: "#378BBA",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                padding: 5,
                borderRadius: 50,
                borderStyle: "solid",
                borderWidth: 6,
                borderColor: "#30B9DB",
            }], (elems_1 = [createElement("label", {
                children: "Points: " + int32ToString(b_3),
                style: {
                    color: "white",
                    fontSize: 20 + "px",
                    fontFamily: "Calibri",
                },
            })], ["children", Interop_reactApi.Children.toArray(Array.from(elems_1))])]))), createElement("br", {}), createElement("div", createObj(ofArray([["style", {
                width: 300,
                height: 70,
                backgroundColor: "#378BBA",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                padding: 5,
                borderRadius: 50,
                borderRadius: 50,
                borderStyle: "solid",
                borderWidth: 6,
                borderColor: "#30B9DB",
            }], (elems_2 = [createElement("button", {
                children: "RESTART",
                style: {
                    color: "white",
                    fontSize: 40 + "px",
                    width: 300,
                    height: 70,
                    borderRadius: 50,
                    backgroundColor: "transparent",
                    fontFamily: "Calibri",
                },
                onClick: (_arg) => {
                    dispatch(new Message(2, []));
                },
            })], ["children", Interop_reactApi.Children.toArray(Array.from(elems_2))])])))], ["children", Interop_reactApi.Children.toArray(Array.from(elems_3))])])));
        }
        default:
            return show(state, dispatch, 0, 0);
    }
}

ProgramModule_run(Program_withReactSynchronous("app", ProgramModule_mkProgram(init, update, render)));

