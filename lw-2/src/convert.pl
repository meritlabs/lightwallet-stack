#!/bin/perl
#
# Run on unix like Systems
#
# Execute this from the directory where your "tsconfig.json" and "app" resides as following:
#
# find . -name "*.ts" | xargs -n 1 perl convert.pl 
#
# Add this to tslint.json 'compilerOptions'
#
#     "paths": {
#         "merit/*": [
#             "./src/app/*"
#         ]
#     }
#
#
use Cwd;
use File::Basename;
use File::Copy;

$cwd=cwd();

$file=shift;
$dir=dirname($file);

open(my $fh, '<', "$file") or die "open failed: $!";
open(my $ofh, '>', "$file.tmp") or die "open failed: $!";

while (<$fh>) {
  my $line = $_;
  if ($line =~ /import\s+\{.+\}\s+from\s+'(\..*)';/) {
    my $oldpath = $1;

    my $relpath = $dir .'/'. $1 . '.ts';
    # Assuming we installed coreutils on OSX
    my $path = `greadlink -f "$relpath"`
      or die "path not found $relpath";
    $path =~ s/^$cwd\///;
    $path =~ s/^/@/;
    $path =~ s/\.ts$//;
    chomp($path);

    $line =~ s/$oldpath/$path/;
    print $ofh $line;
  }
  else {
    print $ofh $line;
  }
}

move("$file.tmp", $file)
  or die "could not move $file.tmp";