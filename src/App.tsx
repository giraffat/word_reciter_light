import React, {useEffect, useRef, useState} from 'react';
import {
    AppBar,
    Box,
    Button,
    Dialog,
    DialogTitle,
    Fade,
    Paper,
    Stack,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import Word from "./Word";
import WordsAnalyzer from './WordsAnalyzer';

interface WordCardProps {
    word: Word;
    moveNext: () => void;
}

function WordCard(props: WordCardProps) {
    const [input, setInput] = useState("");
    const [isError, setIsError] = useState(false);
    const [isTheFirstTime, setIsTheFirstTime] = useState(true);

    function Check(isTheFistTime: boolean) {
        if (input.toLowerCase().trim() === props.word.name) {
            if (isTheFistTime) {
                props.word.needReview = false;
            }
            props.moveNext();
        } else {
            setIsError(true);
            setInput("");

            props.word.needReview = true;
            setIsTheFirstTime(false)
        }
    }

    return (<Paper elevation={4} sx={{padding: 4}}>
            <Stack spacing={2}>
                <Typography variant="h4" component="div">{props.word.definitions}</Typography>
                <TextField variant="filled"
                           autoFocus={true}
                           onKeyDown={event => {
                               if (event.key === "Enter") {
                                   Check(isTheFirstTime);
                               }
                           }}
                           value={input}
                           onChange={event => setInput(event.target.value)}
                           error={isError}
                           placeholder={isError ? props.word.name : ""}
                           label="拼写单词"
                           fullWidth={true}/>
                <Button onClick={() => Check(isTheFirstTime)} fullWidth={true} variant="contained">确定</Button>
            </Stack>
        </Paper>
    );
}

function App() {
    const [thisWord, setThisWord] = useState<Word>();
    const [isFinished, setIsFinished] = useState(false);

    const wordsManager: React.MutableRefObject<AsyncGenerator> = useRef(WordsManager());

    async function* WordsManager() {
        const wordsText = await WordsAnalyzer.WordsText("./words.txt");
        const words = await WordsAnalyzer.analyzeWords(wordsText);

        while (true) {
            let isExecuted = false;

            for (const word of words) {
                if (!word.needReview) {
                    continue;
                }

                isExecuted = true;
                setThisWord(word);
                yield;
            }

            if (!isExecuted) {
                return;
            }

            console.log("a");
        }
    }

    async function MoveNext() {
        if ((await wordsManager.current.next()).done) {
            setIsFinished(true);
        }
    }

    useEffect(() => {
        wordsManager.current.next();
    }, []);

    return (
        <Box sx={{
            background: '#cfd8dc',
            height: '100%',
            display: 'flex',
            flexDirection: 'Column'
        }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flex: 1}}>在线背单词</Typography>
                    <Button color="inherit"
                            onClick={() => window.open("https://github.com/giraffat/word_reciter_light")}>Github</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{
                display: 'flex',
                flex: '1',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {thisWord === undefined
                    ? null
                    : <Fade key={thisWord.name} in={true}>
                        <Box>
                            <WordCard word={thisWord} moveNext={() => MoveNext()}/>
                        </Box>
                    </Fade>
                }

                <Dialog open={isFinished}>
                    <DialogTitle>学习完毕</DialogTitle>
                    <Button onClick={() => window.location.reload()}>重新开始</Button>
                </Dialog>
            </Box>
        </Box>
    );
}

export default App;
