import "./style.css";

const operantMap = {
	0: "nop",
	1: "push-a",
	2: "push-b",
	3: "push-c",
	4: "add",
	5: "subtract",
	6: "multiply",
	7: "divide",
} as const;

type Operant = (typeof operantMap)[keyof typeof operantMap];
type Genome = number[];
type Program = Operant[];

const testProgram = (program: Program, data: number[]) => {
	const stack: number[] = [];
	for (const operant of program) {
		switch (operant) {
			case "push-a":
				stack.push(data[0]);
				break;
			case "push-b":
				stack.push(data[1]);
				break;
			case "push-c":
				stack.push(data[2]);
				break;
			case "add":
				stack.push(stack.pop()! + stack.pop()!);
				break;
			case "subtract":
				stack.push(stack.pop()! - stack.pop()!);
				break;
			case "multiply":
				stack.push(stack.pop()! * stack.pop()!);
				break;
			case "divide":
				stack.push(stack.pop()! / stack.pop()!);
				break;
		}
	}
	console.log(stack);
	if (stack.length !== 1) return undefined;
	return stack.pop()!;
};

const tests = [
	[1, 1, 1, 1],
	[2, 2, 2, 8],
	[3, 3, 3, 27],
	[4, 4, 4, 64],
];

const program: Operant[] = ["push-a", "push-b", "push-c", "multiply", "multiply"];

for (const test of tests) {
	const result = testProgram(program, test);
	if (result !== test[3]) {
		console.log("Test failed!");
	}
}

const randomIntBetween = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomPush = () => randomIntBetween(1, 3);
const randomMathOperant = () => randomIntBetween(4, 7);
const randomOperant = () => randomIntBetween(1, 7);
const isPush = (op: number) => op >= 1 && op <= 3;
const isMathOperant = (op: number) => op >= 4 && op <= 7;

const generateInitialGenome = (maxProgramSize: number) => {
	const program: Genome = [];
	let stackPointer = 0;
	let exit = false;
	for (let i = 0; i < 2; i++) {
		program.push(randomPush());
		stackPointer += 1;
	}
	for (let i = 2; i < maxProgramSize; i++) {
		if (exit) break;
		const op = randomOperant();
		if (isPush(op)) {
			if (stackPointer < 3) {
				program.push(op);
				stackPointer += 1;
			}
		} else {
			program.push(op);
			stackPointer -= 1;
			if (stackPointer === 1) exit = true;
		}
	}
	return program;
};

const genomeToProgram = (genome: Genome): Program => {
	return genome.map((gene) => (operantMap as any)[gene] as Operant);
};

const isProgramValid = (program: Program) => {
	let stackPointer = 0;
	for (const operant of program) {
		if (operant == "nop") continue;
		if (operant.startsWith("push-")) {
			stackPointer++;
		} else {
			stackPointer -= 1;
		}
		return stackPointer === 1;
	}
};

const genome = generateInitialGenome(8);
const genomeProgram = genomeToProgram(genome);
console.log(genome);
console.log(genomeProgram);
console.log(isProgramValid(genomeProgram));
