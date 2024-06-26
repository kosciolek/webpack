import { indexDependencyDependency } from "./index-dependency";
import "./index.css";

indexDependencyDependency();

it("asd", function (done) {
	const postOrder = __STATS__.modules
		.filter(mod => mod.name.endsWith(".css"))
		.map(mod => ({ module: mod.name, postOrderIndex: mod.postOrderIndex }));

	console.log(postOrder);

    // this is the order we'd get if we don't use `"sideEffects": ["*.css"]` in package.json
    // since mini-css-extract-plugin loads .css modules in postOrder order
    // our css classes would be index-dependency-dependency.css (least important) -> index-dependency.css -> index.css
	expect(postOrder).toStrictEqual([
		{ module: "./index.css", postOrderIndex: 5 },
		{ module: "./index-dependency.css", postOrderIndex: 3 },
		{ module: "./index-dependency-dependency.css", postOrderIndex: 1 }
	]);

    
    // this is the actual order with `"sideEffects": ["*.css"]`
    const actualOrder = [
        { module: './index.css', postOrderIndex: 1 },
        // bug: index-dependency-depednency.css will override index.css, even though in reality it was imported first
        { module: './index-dependency-dependency.css', postOrderIndex: 2 },
        // another bug: index-dependency.css is missing from the bundle entirely, even though it should be loaded
        { module: './index-dependency.css', postOrderIndex: null }
      ]

	done();
});
