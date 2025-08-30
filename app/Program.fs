open Elmish
open Feliz
open Elmish.React
open System


type Image = string

let Image1 = "images/1.png"
let Image2 = "images/2.png"
let Image3 = "images/3.png"
let Image4 = "images/4.png"
let Image5 = "images/5.png"
let Image6 = "images/6.png"


type Cell = {
    image : Image
    mutable isThere : bool
    mutable Clicks: int;
}

let mutable Cells : List<Cell> = [
    {image = Image1; isThere=true; Clicks=0};
    {image = Image2; isThere=true; Clicks=0};
    {image = Image3; isThere=true; Clicks=0};
    {image = Image4; isThere=true; Clicks=0};
    {image = Image5; isThere=true; Clicks=0};
    {image = Image6; isThere=true; Clicks=0};
    {image = Image1; isThere=true; Clicks=0};
    {image = Image2; isThere=true; Clicks=0};
    {image = Image3; isThere=true; Clicks=0};
    {image = Image4; isThere=true; Clicks=0};
    {image = Image5; isThere=true; Clicks=0};
    {image = Image6; isThere=true; Clicks=0}
]

type State =
    | Initial
    | AllClosed of int*int
    | OneOpened of int*int*int
    | TwoOpened of int*int*int*int
    | GameOver of int 

type Message =
    | Start
    | ImageClick of int
    | Restart 
    | TimerMessage 
    | Close
    
let timer dispatch = async{
    do! Async.Sleep 1000
    dispatch TimerMessage
}

let delay dispatch = Async.Start (
    timer dispatch
)

let close750 dispatch = async {
    do! Async.Sleep 750
    dispatch Close
}

let delayClose750 dispatch = Async.Start (
    close750 dispatch
)

let close1500 dispatch = async {
    do! Async.Sleep 1500
    dispatch Close
}

let delayClose1500 dispatch = Async.Start (
    close750 dispatch
)

let init () =
    let random = new Random();
    Cells <- Cells |> List.sortBy (fun _ -> random.Next())
    Initial, Cmd.none

let points i j =
    let a =
        match Cells[i].Clicks with
        | x when x<3 -> 10
        | 3 -> 5
        | 4 -> 2
        | _ -> 0
    let b =
        match Cells[j].Clicks with
        | x when x<3 -> 10
        | 3 -> 5
        | 4 -> 2
        | _ -> 0
    a + b

let isEnd () : bool =
    List.forall (fun x -> x.isThere=false) (Cells)

let update (msg:Message)(state:State) = 
    match state with
    | Initial ->
        match msg with
        | Start -> AllClosed(30, 0), Cmd.ofEffect delay
        | _ -> state, Cmd.none
    | AllClosed (t:int,b:int) ->
        if isEnd () || t = 0 then GameOver b, Cmd.none else
        match msg with 
        |   TimerMessage ->
                AllClosed(t-1, b), Cmd.ofEffect delay
        | ImageClick i ->
            Cells[i].Clicks<-Cells[i].Clicks+1
            OneOpened (t, i, b), Cmd.none
        | _ -> 
            state, Cmd.none
    
    | OneOpened (t, i, b) ->
        if t = 0 then (GameOver b, Cmd.none) else
        match msg with
        | TimerMessage ->
            OneOpened(t-1, i, b), Cmd.ofEffect delay
        | ImageClick j ->
            if i = j then state, Cmd.none else
            Cells[j].Clicks<-Cells[j].Clicks+1
            if Cells[i].image = Cells[j].image then
                Cells[i].isThere <- false
                Cells[j].isThere <- false
                let bodovi = points i j

                TwoOpened (t, i, j, b+bodovi), Cmd.ofEffect delayClose1500
            else
                TwoOpened (t, i, j, b), Cmd.ofEffect delayClose750
        | _ -> 
            state, Cmd.none

    | TwoOpened (t, i, j, b) ->
        if t = 0 then (GameOver b, Cmd.none) else
        match msg with
        | Close ->
            AllClosed (t, b), Cmd.none
        | TimerMessage ->
            TwoOpened (t-1, i, j, b), Cmd.ofEffect delay
        | _ -> 
            state, Cmd.none
        
    | GameOver b ->
        let random = new Random();
        Cells <- Cells |> List.sortBy (fun _ -> random.Next())
        for i in [0..11] do
            Cells[i].isThere <- true
            Cells[i].Clicks <- 0
        match msg with
        | Restart -> AllClosed (30, 0), Cmd.ofEffect delay
        | _ -> state, Cmd.none


let ShowCell dispatch i state =
    Html.img [
        prop.style [
            style.width 150
            style.height 150
            style.margin 10
            style.borderRadius 10
        ]

        match state with
        | AllClosed (_, _) when Cells[i].isThere ->
            prop.src "images/black.png"
            prop.onClick (fun _ -> dispatch (ImageClick i))
        
        | OneOpened(_, n, _) when Cells[i].isThere ->
            if n=i then
                prop.src Cells[i].image
            else
                prop.src "images/black.png"
            prop.onClick (fun _ -> dispatch (ImageClick i))

        | TwoOpened (_, n, m, _) ->
            if n=i || m=i then
                prop.src Cells[i].image
            elif Cells[i].isThere then
                prop.src "images/black.png"
            else
                prop.src "images/white.png"
        | _ ->
            prop.src "images/white.png"
            prop.style[
                style.width 150
                style.height 150
                style.margin 10
            ]
    ]
  
let show (state:State) (dispatch) (t:int) (b:int) =
    Html.div[
            prop.style [
                style.backgroundImageUrl "images/jungle.png"
                style.backgroundSize.contain
                style.justifyContent.center
                style.display.flex
                style.alignItems.center
                style.flexDirection.column
                style.margin -10
                style.height 800
            ]
            prop.children[
                Html.div [
                    prop.style [
                        style.marginTop -100
                        style.width 300
                        style.height 70
                        style.backgroundColor "#378BBA"
                        style.justifyContent.center
                        style.display.flex
                        style.alignItems.center
                        style.flexDirection.column
                        style.borderRadius 50
                        style.boxShadow (5, 5, "#30B9DB")
                    ]
                    prop.children [
                        Html.label [
                            prop.text ("Time remaining:  " + (string) t)
                            prop.style [
                                style.color "white"
                                style.fontSize 20
                                style.fontFamily "Calibri"
                            ]
                        ]
                        Html.label [
                            prop.text ("Score:  " + (string) b)
                            prop.style [
                                style.color "white"
                                style.fontSize 20
                                style.fontFamily "Calibri"
                            ]
                        ]                        
                    ]
                ]
                Html.br[];
                Html.div[
                    prop.style [
                        style.backgroundColor "#378BBA"
                        style.width 700
                        style.height 520
                        style.padding 20
                        style.borderStyle.dotted
                        style.borderRadius 20
                        style.borderColor "#30B9DB"
                        style.borderWidth 6
                        style.justifyContent.center
                        style.alignItems.center                 
                    ]
                    match state with
                    | Initial ->
                        prop.children [
                            Html.div [
                                prop.style [
                                    style.justifyContent.center
                                    style.alignItems.center 
                                    style.display.flex
                                    style.alignItems.center
                                ]
                                prop.children [
                                    Html.button [
                                        prop.style [
                                            style.width 200
                                            style.height 100
                                            style.borderRadius 50
                                            style.fontSize 40
                                            style.borderColor "#30B9DB"
                                            style.borderWidth 6
                                            style.color "#378BBA"
                                            style.fontFamily "Calibri"
                                            style.marginTop 200
                                        ]
                                        prop.text "START"
                                        prop.onClick (fun _ -> dispatch Start)
                                    ]
                                ]
                            ]
                        ]
                    | _ -> 
                        prop.children[
                            Html.div [
                                prop.style [
                                    style.justifyContent.center
                                    style.display.flex
                                    style.alignItems.center   
                                ]
                                prop.children [
                                    Html.div [
                                        prop.children [
                                            ShowCell dispatch 0 state;
                                            ShowCell dispatch 1 state;
                                            ShowCell dispatch 2 state;
                                            ShowCell dispatch 3 state;
                                            Html.br []
                                            ShowCell dispatch 4 state;
                                            ShowCell dispatch 5 state;
                                            ShowCell dispatch 6 state;
                                            ShowCell dispatch 7 state;
                                            Html.br[]
                                            ShowCell dispatch 8 state;
                                            ShowCell dispatch 9 state;
                                            ShowCell dispatch 10 state;
                                            ShowCell dispatch 11 state
                                        ]
                                    ]

                                ]
                            ]

                        ]
                ]
            ]
        ]

let render (state:State) (dispatch:Message->unit):Fable.React.ReactElement =
    match state with
    | Initial ->
        show state dispatch 0 0
    | AllClosed (t:int , b:int) ->
        show state dispatch t b
    | OneOpened (t, i, b) ->
        show state dispatch t b
            
    | TwoOpened (t, i,j, b) ->
        show state dispatch t b
    | GameOver b ->
        Html.div[
                prop.style [
                    style.justifyContent.center
                    style.display.flex
                    style.alignItems.center
                    style.flexDirection.column
                    style.padding 20
                ]
                prop.children[
                    Html.br[]
                    Html.div [
                        prop.style [
                            style.width 200
                            style.height 70
                            style.backgroundColor "#378BBA"
                            style.justifyContent.center
                            style.display.flex
                            style.alignItems.center
                            style.flexDirection.column
                            style.padding 5
                            style.borderRadius 50
                            style.borderStyle.dotted
                            style.borderColor "#30B9DB"
                            style.padding 100
                        ]
                        prop.children [
                            Html.img [
                                prop.src "images/gameover.png"
                                prop.width 600
                                prop.height 500
                                prop.style [
                                    style.padding 40
                                ]
                            ]
                        ]
                    ]
                    Html.br[]
                    
                    Html.div [
                        prop.style [
                            style.width 200
                            style.height 70
                            style.backgroundColor "#378BBA"
                            style.justifyContent.center
                            style.display.flex
                            style.alignItems.center
                            style.flexDirection.column
                            style.padding 5
                            style.borderRadius 50
                            style.borderStyle.solid
                            style.borderWidth 6
                            style.borderColor "#30B9DB"
                        ]
                        prop.children [
                            Html.label [
                                prop.text ("Points: " + (string) b)
                                prop.style [
                                    style.color "white"
                                    style.fontSize 20
                                    style.fontFamily "Calibri"
                                ]
                            ]
                        ]
                    ]

                    Html.br[];
                    Html.div [
                        prop.style [
                            style.width 300
                            style.height 70
                            style.backgroundColor "#378BBA"
                            style.justifyContent.center
                            style.display.flex
                            style.alignItems.center
                            style.flexDirection.column
                            style.padding 5
                            style.borderRadius 50
                            style.borderRadius 50
                            style.borderStyle.solid
                            style.borderWidth 6
                            style.borderColor "#30B9DB"
                        ]
                        prop.children [
                            Html.button [
                                prop.text "RESTART"
                                prop.style [
                                    style.color "white"
                                    style.fontSize 40
                                    style.width 300
                                    style.height 70
                                    style.borderRadius 50
                                    style.backgroundColor.transparent
                                    style.fontFamily "Calibri"
                                ]
                                prop.onClick (fun _ -> dispatch Restart)
                            ]
                        ]
                    ]

                ]
            ]
            

Program.mkProgram init update render
|> Program.withReactSynchronous "app"
|> Program.run
