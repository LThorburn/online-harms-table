var dims = [

	{
		title: "None",
		type: "none",
		numGroups: 1
	},


	{
		title: "Audience",
		type: "venn",
		numGroups: 3,
		groups: [
			{
				key: "audience_target",
				label: "Direct",
				description: "Delivery aligns with harm, with content delivered to the person harmed (the target). Blocking helps.",
				summary: "Harm depends on delivery to target"
			},
			{
				key: "audience_others",
				label: "Indirect",
				description: "Content delivered to others and effective without target receiving it. Blocking does not help.",
				summary: "Harm depends on delivery to others"
			}
		]
	},

	{
		title: "Accuracy",
		type: "partition",
		numGroups: 3,
		groups: [
			{
				key: "accuracy_high",
				label: "High Accuracy",
				description: "Can be effective while being essentially true."
			},
			{
				key: "accuracy_mixed",
				label: "Accuracy Varies",
				description: "Some misleading often necessary to be effective."
			},
			{
				key: "accuracy_low",
				label: "Low Accuracy",
				description: "Attack depends on receiver being convinced to believe something false."
			}
		]
	},

	{
		title: "Timespan",
		type: "partition",
		numGroups: 2,
		groups: [
			{
				key: "timespan_long",
				label: "Long Timespan",
				description: "Can be gradual, requiring a sequence of steps over time, and so might be mitigated by being cut off early."
			},
			{
				key: "timespan_short",
				label: "Short Timespan",
				description: "Usually happen all at once, with little possibility of early intervention."
			}
		]
	},

	{
		title: "Accidental or Deliberate",
		type: "venn",
		numGroups: 3,
		groups: [
			{
				key: "accidental",
				label: "Accidental",
				description: "Action is often accidental and can be reduced by education or warnings.",
				summary: "Harm is accidental"
			},
			{
				key: "deliberate",
				label: "Deliberate",
				description: "Action is deliberate and cannot be reduced by education or warnings.",
				summary: "Harm is deliberate"
			}
		]
	},

];