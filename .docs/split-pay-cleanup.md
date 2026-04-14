# Split pay cleanup

The old split-payment and settlement flow was backed up on the `split-pay-fix` branch and removed from `main` here.

What this cleanup keeps:

- plain expense entries only
- required `Paid by` selection when adding an expense
- dashboard expense overview and category-wise totals
- all-expenses table and filter behavior

What this cleanup removes:

- `isSplit`
- `settlementFor`
- `personId`
- `type` on `ledger_entry`
- settlement form and settlement dashboard section
- split-specific summary math and tests

The ledger table now represents expense rows only, and the seed data was trimmed to match the simpler model.
