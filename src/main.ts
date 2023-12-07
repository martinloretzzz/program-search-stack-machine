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

const runProgram = (program: Program, data: number[]) => {
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
	if (stack.length !== 1) return undefined;
	return stack.pop()!;
};

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

const doesProgramPassTests = (tests: number[][], program: Program) => {
	for (const test of tests) {
		const result = runProgram(program, test);
		if (result !== test[3]) return false;
	}
	return true;
};

const mutateGenome = (genome: Genome): Genome => {
	const newGenome = [...genome];
	if (Math.random() < 0.02) newGenome.push(randomOperant());
	if (Math.random() < 0.02) newGenome.pop();
	const index = randomIntBetween(0, genome.length - 1);
	const newGene = index < 2 ? randomPush() : randomOperant();
	newGenome[index] = newGene;
	return newGenome;
};

const mutationProgramSearch = (tests: number[][], populationSize: number, generationCount: number) => {
	const population = [];
	for (let i = 0; i < populationSize; i++) {
		population.push(generateInitialGenome(8));
	}

	for (let gen = 0; gen < generationCount; gen++) {
		console.log(`Generation ${gen}`);
		for (const genome of population) {
			const genomeProgram = genomeToProgram(genome);
			if (isProgramValid(genomeProgram) && doesProgramPassTests(tests, genomeProgram)) {
				console.log(`Found program: ${genomeProgram}`);
				return genomeProgram;
			}
		}

		for (let i = 0; i < populationSize; i++) {
			let mutatedGenome = mutateGenome(population[i]);
			if (!isProgramValid(genomeToProgram(mutatedGenome))) {
				mutatedGenome = generateInitialGenome(8);
			}
			population[i] = mutatedGenome;
		}
	}
};

const randomProgramSearch = (tests: number[][], attempts: number = 100) => {
	for (let i = 0; i < attempts; i++) {
		const genome = generateInitialGenome(8);
		const genomeProgram = genomeToProgram(genome);
		// console.log(genome);
		// console.log(genomeProgram);
		// console.log(isProgramValid(genomeProgram));

		const isTestsFailing = !doesProgramPassTests(tests, genomeProgram);

		if (isTestsFailing) console.log(`${i}: Tests failed!`);

		if (!isTestsFailing) {
			console.log(`${i}: Found right program!`);
			return genomeProgram;
		}
	}
};

const tests = [
	[1, 1, 1, 1],
	[2, 2, 2, 8],
	[3, 3, 3, 27],
	[4, 4, 4, 64],
];

const testsAplusBmulC = [
	[1, 1, 1, 2],
	[2, 3, 3, 11],
	[3, 1, 3, 6],
	[4, 2, 4, 12],
];

const program = mutationProgramSearch(testsAplusBmulC, 20, 50);
console.log(program);
