using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Files
{
    public class File : BaseFile
    {
        public string Name { get; set; }

        public string Url { get; set; }

        public LookUp FileTypeId { get; set; }

        public bool IsDeleted { get; set; }

        public BaseUser CreatedBy { get; set; }
    }
}
