const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vote contract", function() {
    let Vote;
    let vote;
    let owner;
    let addr1;
    let addr2;
    beforeEach(async function() {
        // validacion de usuarios
        Vote = await ethers.getContractFactory("Vote");
        [owner, addr1, addr2] = await ethers.getSigners();

        vote = await Vote.deploy();
    });

    describe("Deploy", function() {
        it("Should set correctly the chairperson", async function() {
            expect(await vote.getChairPerson()).to.equal(owner.address);
        })

    })
    describe("Add proposals", function() {
        it("Should return 0 proposals", async function() {
            const addProposalTx = await vote.addProposal("Hernan");
            // add candidatos- reflejar en la blockain
            await addProposalTx.wait();
            expect(await vote.getProposals()).to.equal(1);
        });
        // validacion de administrador
        it("Should return 1 proposals", async function() {
            await expect(vote.connect(addr1).addProposal("Isabel")).to.be.revertedWith("the caller of this function must be the administrator")
        });
    });
    describe("Vote", function() {
        // retencion de los datos 
        beforeEach(async function() {
            await vote.addProposal("test1");
            await vote.addProposal("test2");
            await vote.addProposal("test3");
            await vote.connect(addr2).vote(2);

        }); // se realiza voto
        it("Should add 1 vote to first proposal", async function() {
                await vote.connect(addr1).vote(1);
                expect(await vote.getVotesById(1)).to.equal(1);
            }) // no se realiza el voto
        it("Should can't vote", async function() {
            await expect(vote.connect(addr2).vote(1)).to.be.revertedWith("you already voted")
        })
    })
});