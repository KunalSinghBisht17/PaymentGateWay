using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Payment_GateWay.Model
{
    public class PaymentDetail
    {
        [Key]
        //need to learn about nullable(only for refrence type)
        public int PaymentDetailId { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string CardOwnerName { get; set; } = "";
        [Column(TypeName = "nvarchar(100)")]
        public string CardNumber { get; set; } = "";
        [Column(TypeName = "nvarchar(100)")]
        public string ExpirationDate { get; set; } = "";
        [Column(TypeName = "nvarchar(100)")]
        public string SecurityCode { get; set; } = "";

    }
}
