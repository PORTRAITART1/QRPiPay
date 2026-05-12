/**
 * 🔗 Smart Contract - PiRC-2 Token Standard
 * Contrat pour NFT reçus de paiement QRPiPay
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract QRPiPayReceipt is ERC721, Ownable {
    using Counters for Counters.Counter;
    private Counters.Counter private _tokenIdCounter;

    struct PaymentReceipt {
        uint256 amount; // En Pi
        string description;
        uint256 timestamp;
        address merchant;
        string transactionId;
        bool verified;
    }

    mapping(uint256 => PaymentReceipt) public receipts;
    mapping(string => bool) public usedTransactionIds;
    
    // Events
    event ReceiptMinted(
        uint256 indexed tokenId,
        address indexed merchant,
        uint256 amount,
        string transactionId
    );
    
    event ReceiptVerified(
        uint256 indexed tokenId,
        bool verified
    );

    constructor() ERC721("QRPiPay Receipt", "QRPI") {}

    /**
     * Mint payment receipt as NFT
     */
    function mintReceipt(
        address merchant,
        uint256 amount,
        string memory description,
        string memory transactionId
    ) public onlyOwner returns (uint256) {
        require(
            !usedTransactionIds[transactionId],
            "Transaction already used"
        );
        require(amount > 0, "Amount must be greater than 0");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        receipts[tokenId] = PaymentReceipt({
            amount: amount,
            description: description,
            timestamp: block.timestamp,
            merchant: merchant,
            transactionId: transactionId,
            verified: false
        });

        usedTransactionIds[transactionId] = true;

        _safeMint(merchant, tokenId);

        emit ReceiptMinted(tokenId, merchant, amount, transactionId);

        return tokenId;
    }

    /**
     * Verify receipt on-chain
     */
    function verifyReceipt(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Receipt does not exist");
        receipts[tokenId].verified = true;
        emit ReceiptVerified(tokenId, true);
    }

    /**
     * Get receipt details
     */
    function getReceipt(uint256 tokenId)
        public
        view
        returns (PaymentReceipt memory)
    {
        require(_exists(tokenId), "Receipt does not exist");
        return receipts[tokenId];
    }

    /**
     * Get total receipts count
     */
    function getTotalReceipts() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * Token URI for metadata
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Receipt does not exist");
        
        PaymentReceipt memory receipt = receipts[tokenId];
        
        // Return JSON metadata
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name":"QRPiPay Receipt #',
                        toString(tokenId),
                        '","description":"',
                        receipt.description,
                        '","attributes":[{"trait_type":"Amount","value":"',
                        toString(receipt.amount),
                        '"},{"trait_type":"Verified","value":"',
                        receipt.verified ? "Yes" : "No",
                        '"}]}'
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    /**
     * Utility function to convert uint to string
     */
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

/**
 * Base64 Library for metadata encoding
 */
library Base64 {
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        uint256 encodedLen = 4 * ((len + 2) / 3);
        bytes memory result = new bytes(encodedLen + 32);

        uint256 j = 32;

        for (uint256 i = 0; i < len; i += 3) {
            bytes1 a0 = i < len ? data[i] : 0;
            bytes1 a1 = i + 1 < len ? data[i + 1] : 0;
            bytes1 a2 = i + 2 < len ? data[i + 2] : 0;

            uint24 bitmap = (uint24(uint8(a0)) << 16) | (uint24(uint8(a1)) << 8) | uint24(uint8(a2));

            result[j++] = TABLE[uint8(bitmap >> 18)];
            result[j++] = TABLE[uint8((bitmap >> 12) & 63)];
            result[j++] = i + 1 < len ? TABLE[uint8((bitmap >> 6) & 63)] : "=";
            result[j++] = i + 2 < len ? TABLE[uint8(bitmap & 63)] : "=";
        }

        return string(result);
    }
}
