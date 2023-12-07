import "./style.css";

const operantMap = {
	0: "push-a",
	1: "push-b",
	2: "push-c",
	3: "add",
	4: "subtract",
	5: "multiply",
	6: "divide",
} as const;

type Operant = (typeof operantMap)[keyof typeof operantMap];
type Genome = number[];
type Program = Operant[];

interface Test {
	x: number[];
	y: number;
}

const randomIntBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const randomPush = () => randomIntBetween(0, 2);
const randomMathOperant = () => randomIntBetween(3, 6);
const randomOperant = () => randomIntBetween(0, 6);
const isPush = (op: number) => op >= 0 && op <= 2;
const isMathOperant = (op: number) => op >= 3 && op <= 6;

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

const isGenomeValid = (genome: Genome) => {
	let stackPointer = 0;
	for (const opId of genome) {
		if (isPush(opId)) {
			stackPointer++;
		} else {
			stackPointer -= 1;
		}
		return stackPointer === 1;
	}
};

const doesGenomePassTests = (tests: Test[], genome: Genome) => {
	for (const test of tests) {
		const result = runGenome(genome, test.x);
		if (result !== test.y) return false;
	}
	return true;
};

const runGenome = (genome: Genome, data: number[]) => {
	const stack: number[] = [];
	for (const operant of genome) {
		switch (operant) {
			case 0:
				stack.push(data[0]);
				break;
			case 1:
				stack.push(data[1]);
				break;
			case 2:
				stack.push(data[2]);
				break;
			case 3:
				stack.push(stack.pop()! + stack.pop()!);
				break;
			case 4:
				stack.push(stack.pop()! - stack.pop()!);
				break;
			case 5:
				stack.push(stack.pop()! * stack.pop()!);
				break;
			case 6:
				stack.push(stack.pop()! / stack.pop()!);
				break;
		}
	}
	if (stack.length !== 1) return undefined;
	return stack.pop()!;
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

const mutationProgramSearch = (tests: Test[], populationSize: number, generationCount: number) => {
	const population = [];
	for (let i = 0; i < populationSize; i++) {
		population.push(generateInitialGenome(8));
	}

	for (let gen = 0; gen < generationCount; gen++) {
		console.log(`Generation ${gen}`);
		for (const genome of population) {
			if (isGenomeValid(genome) && doesGenomePassTests(tests, genome)) {
				const genomeProgram = genomeToProgram(genome);
				console.log(`Found program: ${genomeProgram}`);
				return genomeProgram;
			}
		}

		for (let i = 0; i < populationSize; i++) {
			let mutatedGenome = mutateGenome(population[i]);
			if (!isGenomeValid(mutatedGenome)) {
				mutatedGenome = generateInitialGenome(8);
			}
			population[i] = mutatedGenome;
		}
	}
};

const randomProgramSearch = (tests: Test[], attempts: number = 100) => {
	for (let i = 0; i < attempts; i++) {
		const genome = generateInitialGenome(8);
		const genomeProgram = genomeToProgram(genome);

		const isTestsFailing = !doesGenomePassTests(tests, genome);

		if (isTestsFailing) console.log(`${i}: Tests failed!`);

		if (!isTestsFailing) {
			console.log(`${i}: Found right program!`);
			return genomeProgram;
		}
	}
};

const tests = [
	{ x: [1, 1, 1], y: 1 },
	{ x: [2, 2, 2], y: 8 },
	{ x: [3, 3, 3], y: 27 },
	{ x: [4, 4, 4], y: 64 },
];

const testsAplusBmulC = [
	{ x: [1, 1, 1], y: 2 },
	{ x: [2, 3, 3], y: 11 },
	{ x: [3, 1, 3], y: 6 },
	{ x: [4, 2, 4], y: 12 },
];

const program = mutationProgramSearch(testsAplusBmulC, 20, 100);
console.log(program);
