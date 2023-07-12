const { expect } = require("chai");
const sinon = require("sinon");
const db = require("../database/models.js");
const AccountController = require("../controllers/Account.js");

const conta_id = (
  Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000
).toString();

const conta_id_bonus = (
  Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000
).toString();

const conta_id_poupanca = (
  Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000
).toString();

describe("AccountController", () => {
  after(async () => {
    await db.sequelize.close();
  });

  describe("createAccount", () => {
    it("should return 400 if required parameters are missing", async () => {
      const req = { body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.createAccount(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Required parameter missing",
        })
      ).to.be.true;
    });

    it("should return 400 if account type is invalid", async () => {
      const req = { body: { id: conta_id, type: "InvalidType" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.createAccount(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Wrong type for account.",
        })
      ).to.be.true;
    });

    it("should create a new account with type Simples", async () => {
      const req = { body: { id: conta_id, type: "Simples", balance: 100 } };
      const res = {
        json: sinon.spy(),
      };
      await AccountController.createAccount(req, res);
      expect(
        res.json.calledWith({
          error: false,
          data: {
            id: conta_id,
            balance: 100,
            type: "Simples",
          },
        })
      ).to.be.true;
    });

    it("should create a new account with type Bonus", async () => {
      const req = { body: { id: conta_id_bonus, type: "Bonus" } };
      const res = {
        json: sinon.spy(),
      };
      await AccountController.createAccount(req, res);
      expect(
        res.json.calledWith({
          error: false,
          data: {
            id: conta_id_bonus,
            balance: 0,
            type: "Bonus",
            bonus_points: 10,
          },
        })
      ).to.be.true;
    });

    it("should create a new account with type Poupanca", async () => {
      const req = {
        body: { id: conta_id_poupanca, type: "Poupanca", balance: 200 },
      };
      const res = {
        json: sinon.spy(),
      };
      await AccountController.createAccount(req, res);
      expect(
        res.json.calledWith({
          error: false,
          data: {
            id: conta_id_poupanca,
            balance: 200,
            type: "Poupanca",
          },
        })
      ).to.be.true;
    });

    it("should return 400 if account already exists", async () => {
      const req = { body: { id: conta_id, type: "Simples" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.createAccount(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Account already exists.",
        })
      ).to.be.true;
    });
  });

  describe("getBalance", () => {
    it("should return 400 if required parameters are missing", async () => {
      const req = { params: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.getBalance(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Required parameter missing.",
        })
      ).to.be.true;
    });

    it("should return 404 if account is not found", async () => {
      const req = { params: { id: 999 } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.getBalance(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Account not found.",
        })
      ).to.be.true;
    });

    it("should return the balance of an existing account with type Simples or Poupanca", async () => {
      const req = { params: { id: conta_id_poupanca } };
      const res = {
        json: sinon.spy(),
      };
      await AccountController.getBalance(req, res);

      expect(
        res.json.calledWith({
          error: false,
          data: {
            id: conta_id_poupanca,
            balance: 200,
            type: "Poupanca",
          },
        })
      ).to.be.true;
    });

    it("should return the balance and bonus points of an existing account with type Bonus", async () => {
      const req = { params: { id: conta_id_bonus } };
      const res = {
        json: sinon.spy(),
      };
      await AccountController.getBalance(req, res);
      expect(
        res.json.calledWith({
          error: false,
          data: {
            id: conta_id_bonus,
            balance: 0,
            type: "Bonus",
            bonus_points: 10,
          },
        })
      ).to.be.true;
    });
  });

  describe("creditBalance", () => {
    it("should return 400 if required parameters are missing", async () => {
      const req = { body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.creditBalance(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Required parameter missing.",
        })
      ).to.be.true;
    });

    it("should return 400 if value parameter is invalid", async () => {
      const req = { body: { id: conta_id, value: -100 } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.creditBalance(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Required parameter invalid.",
        })
      ).to.be.true;
    });

    it("should credit the balance of an existing account with type Simples or Poupanca", async () => {
      const req = { body: { id: conta_id, value: 100 } };
      const res = {
        json: sinon.spy(),
      };
      await AccountController.creditBalance(req, res);
      expect(
        res.json.calledWith({
          error: false,
          data: {
            id: conta_id,
            balance: 200,
            type: "Simples",
          },
        })
      ).to.be.true;
    });

    it("should credit the balance and bonus points of an existing account with type Bonus", async () => {
      const req = { body: { id: conta_id_bonus, value: 200 } };
      const res = {
        json: sinon.spy(),
      };
      await AccountController.creditBalance(req, res);
      expect(
        res.json.calledWith({
          error: false,
          data: {
            id: conta_id_bonus,
            balance: 200,
            type: "Bonus",
            bonus_points: 12,
          },
        })
      ).to.be.true;
    });

    it("should return 404 if account is not found", async () => {
      const req = { body: { id: "9999", value: 100 } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.creditBalance(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Account not found.",
        })
      ).to.be.true;
    });
  });

  describe("debitBalance", () => {
    it("should return 400 if required parameters are missing", async () => {
      const req = { body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.debitBalance(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Required parameter missing.",
        })
      ).to.be.true;
    });

    it("should return 400 if value parameter is invalid", async () => {
      const req = { body: { id: conta_id, value: -100 } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.debitBalance(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Required parameter invalid.",
        })
      ).to.be.true;
    });

    it("should debit the balance of an existing account with type Bonus", async () => {
      const req = { body: { id: conta_id_bonus, value: 50 } };
      const res = {
        json: sinon.spy(),
      };
      await AccountController.debitBalance(req, res);
      expect(
        res.json.calledWith({
          error: false,
          data: {
            id: conta_id_bonus,
            balance: 150,
            type: "Bonus",
            bonus_points: 12,
          },
        })
      ).to.be.true;
    });

    it("should return 404 if account is not found", async () => {
      const req = { body: { id: "9999", value: 100 } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.debitBalance(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Account not found.",
        })
      ).to.be.true;
    });

    it("should return 503 if balance is insufficient for type Simples or Poupanca", async () => {
      const req = { body: { id: conta_id, value: 200 } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.debitBalance(req, res);
      expect(res.status.calledWith(503)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Insufficient balance.",
        })
      ).to.be.true;
    });
  });

  describe("transferBalance", () => {
    it("should return 400 if required parameters are missing", async () => {
      const req = { body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.transferBalance(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Required parameter missing.",
        })
      ).to.be.true;
    });

    it("should return 400 if value parameter is invalid", async () => {
      const req = {
        body: {
          originId: conta_id,
          destinationId: conta_id_bonus,
          value: -100,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.transferBalance(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Required parameter invalid.",
        })
      ).to.be.true;
    });

    it("should return 404 if origin account is not found", async () => {
      const req = {
        body: { originId: "9999", destinationId: "5678", value: 100 },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.transferBalance(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Origin Account not found.",
        })
      ).to.be.true;
    });

    it("should return 404 if destination account is not found", async () => {
      const req = {
        body: {
          originId: conta_id_poupanca,
          destinationId: "9999999",
          value: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.transferBalance(req, res);

      expect(res.status.calledWith(404)).to.be.true;

      expect(
        res.json.calledWith({
          error: true,
          message: "Destination Account not found.",
        })
      ).to.be.true;
    });

    it("should return 503 if balance is insufficient for type Simples or Poupanca", async () => {
      const req = {
        body: { originId: "1234", destinationId: "5678", value: 200 },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.transferBalance(req, res);
      expect(res.status.calledWith(503)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Insufficient balance",
        })
      ).to.be.true;
    });

    

    it("test bonus points for Bonus type accounts in transferences", async () => {
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const id = (Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000).toString();
      const ammount = Math.floor(Math.random() * 1000 + 1);

      await db.Accounts.create({
        account: id,
        balance: ammount,
        type: "Simples"}
      );

      const req = {
        body: {
          originId: id, 
          destinationId: conta_id_bonus, 
          value: Math.min(ammount, Math.floor(Math.random() * ammount + 1)),
        }};

      const destinationAccount = await db.Accounts.findOne({ where: { account: conta_id_bonus }});
      await AccountController.transferBalance(req, res);
      const updatedDestinationAccount = await db.Accounts.findOne({ where: { account: conta_id_bonus }});

      const expectedBonusPoints = destinationAccount.bonus_points + Math.floor(req.body.value / 150);

      expect(updatedDestinationAccount.bonus_points).to.equal(expectedBonusPoints);
    });

  });

  describe("yieldInterest", () => {
    it("should return 400 if required parameters are missing", async () => {
      const req = { body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.yieldInterest(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Required parameter missing.",
        })
      ).to.be.true;
    });

    it("should return 400 if interestRate parameter is invalid", async () => {
      const req = { body: { id: conta_id_poupanca, interestRate: -1 } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.yieldInterest(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message: "Required parameter invalid.",
        })
      ).to.be.true;
    });

    it("should return 400 if account type is not Poupanca", async () => {
      const req = { body: { id: conta_id, interestRate: 10 } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      await AccountController.yieldInterest(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: true,
          message:
            "Operation 'Yield Interests' only supported for account type 'Poupança'.",
        })
      ).to.be.true;
    });

    it("should yield interest correctly for all accounts of type Poupança", async () => {
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const poupancaAccounts = await db.Accounts.findAll({ where: { type: "Poupança" } });

      await Promise.all(poupancaAccounts.map(async (account) => {
        var req = { body: { id: account.account, interestRate: Math.random() * (100 + 1) }};
        const expectedBalance = account.balance * (1 + req.body.interestRate / 100);

        await AccountController.yieldInterest(req, res);
        const updatedAccPoupanca = await db.Accounts.findOne({ where: { account: account.account } });

        expect(updatedAccPoupanca.balance).to.equal(expectedBalance);
      }));
    });
    
  });
});
