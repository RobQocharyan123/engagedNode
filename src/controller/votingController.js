// export const createVote = async (req, res) => {
//   const { firstOption, name, secondOption, number } = req.body;

//   if (!firstOption || !name || !secondOption) {
//     return res.status(400).json({
//       error: 'First option, name, and second option are required.',
//     });
//   }

//   if (secondOption === 'yes' && !number) {
//     return res.status(400).json({
//       error: 'Number is required when secondOption is "yes".',
//     });
//   }

//   try {
//     const vote = new Voting({
//       firstOption,
//       name,
//       secondOption,
//       number: secondOption === 'yes' ? number : undefined,
//     });

//     await vote.save();

//     res.status(201).json({
//       message: 'Form submitted successfully.',
//       data: vote,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: 'Failed to submit form.', details: error.message });
//   }
// };
