import "./style.css";

const operants = ["push-a", "push-b", "push-c", "add", "subtract", "multiply", "divide"] as const;
type Operant = (typeof operants)[number];

const testProgram = (program: Operant[], data: number[]) => {
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
